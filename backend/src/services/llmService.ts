import Groq from "groq-sdk";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { toolsList } from '../utils/tool_list';
import { ToolExecutor } from './tools';
import { systemPrompt } from '../utils/systemPrompt';
import { logInteraction } from '../utils/logging';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Abstract base class for LLM providers
abstract class BaseLLMProvider {
    protected toolExecutor: ToolExecutor;

    constructor() {
        this.toolExecutor = new ToolExecutor();
    }

    abstract processMessage(userInput: string, identifier: string): Promise<any>;

    // Move handleToolCalls to be a proper method of the base class
    protected async handleToolCalls(message: any) {
        console.log('Raw message from LLM:', JSON.stringify(message, null, 2));
        
        // Helper to normalize chat responses
        const normalizeChatResponse = (content: any): string => {
            if (typeof content === 'string') {
                try {
                    // Check if it's already JSON
                    const parsed = JSON.parse(content);
                    if (parsed.chat) {
                        return content; // Already in correct format
                    }
                } catch (e) {
                    // Not JSON, continue with normalization
                }
            }
            return JSON.stringify({ chat: content });
        };

        if (!message.tool_calls || message.tool_calls.length === 0) {
            console.log('No tool calls found in message');
            const content = message.content || 
                           (typeof message === 'string' ? message : 
                           (message.chat?.content || message));
            return normalizeChatResponse(content);
        }

        const normalizeToolCall = (toolCall: any) => {
            const functionName = toolCall.function.name;
            let functionArgs = toolCall.function.arguments || toolCall.function.parameters;
            
            if (typeof functionArgs === 'string') {
                functionArgs = JSON.parse(functionArgs);
            }

            return {
                functionName,
                params: functionArgs
            };
        };

        try {
            if (message.tool_calls.length === 1) {
                const { functionName, params } = normalizeToolCall(message.tool_calls[0]);
                console.log('Processing single tool call:', { functionName, params });
                return await this.toolExecutor.executeFunction(functionName, params);
            }

            const commands = message.tool_calls.map(normalizeToolCall);
            console.log('Processing multiple tool calls:', commands);
            return await this.toolExecutor.executeFunctions(commands);
        } catch (error) {
            console.error('Error processing tool calls:', error);
            return normalizeChatResponse(
                "I apologize, but I encountered an error processing that command. Could you please rephrase it?"
            );
        }
    }
}

// Groq implementation
class GroqProvider extends BaseLLMProvider {
    private client: Groq;

    constructor() {
        super();
        this.client = new Groq({ apiKey: process.env.GROQ_APIKEY });
    }

    async processMessage(userInput: string, identifier: string): Promise<any> {
        const response = await this.client.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userInput }
            ],
            model: "llama3-groq-70b-8192-tool-use-preview",
            tools: toolsList as any,
            tool_choice: "auto"
        });
        return this.handleToolCalls(response.choices[0]?.message);
    }
}

// OpenAI implementation with type fixes
class OpenAIProvider extends BaseLLMProvider {
    private client: OpenAI;

    constructor() {
        super();
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async processMessage(userInput: string, identifier: string): Promise<any> {
        const response = await this.client.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `${systemPrompt}\n\nWhen a user request requires multiple actions , please use multiple tool calls in a single response. For example, 'Store Q2 and label it beginning' should trigger both store_cue and label_control tools.` 
                },
                { role: "user", content: userInput }
            ],
            model: "gpt-4-turbo-preview",
            tools: [...toolsList] as any,
            tool_choice: "auto"
        });
        return this.handleToolCalls(response.choices[0]?.message);
    }
}

// Gemini implementation
class GeminiProvider extends BaseLLMProvider {
    private client: GoogleGenerativeAI;

    constructor() {
        super();
        this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }

    async processMessage(userInput: string, identifier: string): Promise<any> {
        const model = this.client.getGenerativeModel({ model: "gemini-pro" });
        
        const enhancedPrompt = `${systemPrompt}

Available tools:
${JSON.stringify(toolsList, null, 2)}

User input: ${userInput}

Remember to respond in this exact JSON format if using tools:
{
    "tool_calls": [
        {
            "function": {
                "name": "tool_name",
                "parameters": {"param1": "value1"}
            }
        }
    ]
}

For chat responses, just respond with the plain text message.`;

        const response = await model.generateContent(enhancedPrompt);
        const result = await response.response.text();

        try {
            // Try to parse as JSON for tool calls
            const parsedResponse = JSON.parse(result);
            if (parsedResponse.tool_calls) {
                return parsedResponse;
            }
            // If it's not tool calls, treat as chat
            return parsedResponse.content || parsedResponse;
        } catch (e) {
            // If not valid JSON, it's a plain text chat response
            return result;
        }
    }
}

// Add type for provider rotation
type ProviderStats = {
    lastUsed: number;
    errorCount: number;
    totalCalls: number;
};

// Modified LLMService with rotation
export class LLMService {
    private providers: Map<string, BaseLLMProvider>;
    private providerStats: Map<string, ProviderStats>;
    private readonly rotationInterval = 1000; // 1 second between provider switches

    constructor() {
        this.providers = new Map<string, BaseLLMProvider>([
            ['groq', new GroqProvider()],
            ['openai', new OpenAIProvider()],
            ['gemini', new GeminiProvider()]
        ]);

        // Initialize stats for each provider
        this.providerStats = new Map(
            Array.from(this.providers.keys()).map(key => [
                key,
                { lastUsed: 0, errorCount: 0, totalCalls: 0 }
            ])
        );
    }

    private selectProvider(): string {
        const now = Date.now();
        let selectedProvider = 'groq'; // default
        let longestWait = 0;

        // Find the provider that hasn't been used for the longest time
        this.providerStats.forEach((stats, provider) => {
            const waitTime = now - stats.lastUsed;
            if (waitTime > longestWait) {
                longestWait = waitTime;
                selectedProvider = provider;
            }
        });

        return selectedProvider;
    }

    async processRequest(
        userInput: string, 
        identifier: string = 'unknown', 
        provider?: string
    ): Promise<any> {
        try {
            // If no provider specified, use rotation
            const selectedProvider = provider || this.selectProvider();
            
            console.log('LLM Request:', {
                provider: selectedProvider,
                identifier,
                userInput,
                timestamp: new Date().toISOString()
            });

            const llmProvider = this.providers.get(selectedProvider);
            if (!llmProvider) {
                throw new Error(`Provider ${selectedProvider} not found`);
            }

            // Update provider stats
            const stats = this.providerStats.get(selectedProvider)!;
            stats.lastUsed = Date.now();
            stats.totalCalls++;

            const result = await llmProvider.processMessage(userInput, identifier);
            logInteraction(userInput, result, identifier, selectedProvider);
            return result;

        } catch (error) {
            // Update error count for the provider
            if (provider) {
                const stats = this.providerStats.get(provider);
                if (stats) stats.errorCount++;
            }
            console.error('Error in LLM service:', error);
            throw error;
        }
    }

    // Method to get provider statistics
    getProviderStats(): Record<string, ProviderStats> {
        return Object.fromEntries(this.providerStats);
    }
}