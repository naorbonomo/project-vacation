import express from 'express';
import { LLMService } from '../services/llmService';

export const llmRouter = express.Router();
const llmService = new LLMService();

llmRouter.post('/chat', async (req, res, next) => {
    try {
        const { message, provider } = req.body;
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

        const response = await llmService.processRequest(message, identifier, provider);
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Add endpoint to get provider statistics
llmRouter.get('/stats', (req, res) => {
    const stats = llmService.getProviderStats();
    res.json(stats);
}); 