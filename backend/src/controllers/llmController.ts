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

        let identifier = req.body.identifier || 
                        req.ip || 
                        req.headers['x-forwarded-for'] || 
                        'unknown';
        
        if (identifier.startsWith('::ffff:')) {
            identifier = identifier.substring(7);
        }

        const response = await llmService.processRequest(message, identifier);
        res.json(response);
    } catch (error) {
        next(error);
    }
}); 