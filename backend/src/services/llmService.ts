import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';
import { toolsList } from '../utils/tool_list';
import { ToolExecutor } from './tools';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const groq = new Groq({ apiKey: process.env.GROQ_APIKEY });
const toolExecutor = new ToolExecutor();

export class LLMService {
    async processRequest(userInput: string): Promise<any> {
        try {
            // Type assertion to satisfy Groq's type requirements
            const response = await groq.chat.completions.create({
                messages: [{
                    role: "user",
                    content: userInput
                }],
                model: "llama3-groq-70b-8192-tool-use-preview",
                tools: toolsList as any,
                tool_choice: "auto"
            });

            console.log("LLM Response:", response);

            const message = response.choices[0]?.message;
            
            // If there's a tool call, execute it and return the command
            if (message.tool_calls && message.tool_calls.length > 0) {
                const toolCall = message.tool_calls[0];
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);
                
                return await toolExecutor.executeFunction(functionName, functionArgs);
            }

            // If no tool call, return chat format
            return JSON.stringify({ chat: message.content });

        } catch (error) {
            console.error('Error in LLM service:', error);
            throw error;
        }
    }
} 