// backend/controllers/userController.ts
import express, { Request, Response } from 'express';
import { getUserIdByEmail } from '../services/userService';

export const userRouter = express.Router();

userRouter.get('/api/user-id', async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const userId = await getUserIdByEmail(email as string);
        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user_id: userId });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
