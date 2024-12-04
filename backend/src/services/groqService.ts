import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const groq = new Groq({ apiKey: process.env.GROQ_APIKEY });

export async function findVacationPreferences(userInput: string, availableVacations: string) {
    const prompt = `
        User Preferences: ${userInput}
        Available Vacations:
        ${availableVacations}
        Suggest the most suitable vacation for the user. 
        do NOT add or ask for more information from the user.
        Please return the response in JSON format example: {vacation_id: <number>}

    `;

    const res = await groq.chat.completions.create(
        {
            messages: [{
                role: "user",
                content: prompt,
            }],
            model: "llama3-groq-70b-8192-tool-use-preview"
        });

    const responseContent = res.choices[0]?.message?.content;

    console.log("Prompt:", prompt);  // Log the prompt
    console.log("Raw Response from Groq API:", responseContent);  // Log the raw response

    if (!responseContent) {
        throw new Error('Invalid response from Groq API');
    }

    try {
        // Attempt to parse the response as JSON
        return JSON.parse(responseContent);
    } catch (error) {
        console.error("Error parsing Groq API response as JSON:", error);
        // Return the raw response content if JSON parsing fails
        return responseContent;
    }
}
