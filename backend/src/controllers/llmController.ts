import express from 'express';
import { LLMService } from '../services/llmService';

export const llmRouter = express.Router();
const llmService = new LLMService();

llmRouter.post('/chat', async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await llmService.processRequest(message);
        res.json(response);
    } catch (error) {
        next(error);
    }
}); 