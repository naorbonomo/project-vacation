import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { toolsList } from '../utils/tool_list';
import { ToolExecutor } from './tools';
import { systemPrompt } from '../utils/systemPrompt';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const groq = new Groq({ apiKey: process.env.GROQ_APIKEY });
const toolExecutor = new ToolExecutor();

// Modify the logging function to accept an identifier
const logInteraction = (input: string, output: any, identifier: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        identifier,  // This could be IP address, user ID, or session ID
        input,
        output,
    };
    
    const logPath = path.join(__dirname, '..', 'logs', 'interactions.log');
    fs.appendFileSync(
        logPath,
        JSON.stringify(logEntry, null, 2) + '\n---\n',
        'utf-8'
    );
};

export class LLMService {
    // Modify the method signature to accept an identifier
    async processRequest(userInput: string, identifier: string = 'unknown'): Promise<any> {
        try {
            // Log the complete prompt context being sent to LLM
            console.log('LLM Prompt:', {
                identifier,
                userInput,
                timestamp: new Date().toISOString(),
                tools: toolsList,
                model: "llama3-groq-70b-8192-tool-use-preview",
                systemPrompt
            });

            // Type assertion to satisfy Groq's type requirements
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userInput
                    }
                ],
                model: "llama3-groq-70b-8192-tool-use-preview",
                tools: toolsList as any,
                tool_choice: "auto"
            });

            console.log("LLM Response:", response);

            const message = response.choices[0]?.message;
            
            let result;
            if (message.tool_calls && message.tool_calls.length > 0) {
                if (message.tool_calls.length === 1) {
                    // Single command
                    const toolCall = message.tool_calls[0];
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    result = await toolExecutor.executeFunction(functionName, functionArgs);
                } else {
                    // Multiple commands
                    const commands = message.tool_calls.map(toolCall => ({
                        functionName: toolCall.function.name,
                        params: JSON.parse(toolCall.function.arguments)
                    }));
                    result = await toolExecutor.executeFunctions(commands);
                }
            } else {
                result = JSON.stringify({ chat: message.content });
            }

            // Update the logging call to include the identifier
            logInteraction(userInput, result, identifier);
            
            return result;

        } catch (error) {
            console.error('Error in LLM service:', error);
            throw error;
        }
    }
} 