import express, { Request, Response } from 'express';
import { findVacationPreferences } from '../services/groqService';
import { getAllVacations } from '../services/vacationService';

export const vacationRecommendationRouter = express.Router();

vacationRecommendationRouter.post('/api/vacation-recommendation', async (req: Request, res: Response) => {
    const { preferences } = req.body;

    if (!preferences) {
        return res.status(400).json({ message: 'Vacation preferences are required' });
    }

    try {
        // Fetch existing vacations
        const vacations = await getAllVacations();

        // Format available vacations to pass to the Groq API
        const vacationList = vacations.map(vacation => ({
            destination: vacation.destination,
            description: vacation.description,
            price: vacation.price,
            start_date: vacation.start_date,
            end_date: vacation.end_date
        }));

        const availableVacations = JSON.stringify(vacationList, null, 2); // Pass formatted vacations as a string

        // Send preferences and available vacations to the Groq API for a recommendation
        const recommendation = await findVacationPreferences(preferences, availableVacations);

        res.status(200).json({ recommendation });
    } catch (error) {
        console.error('Error fetching vacation recommendation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
