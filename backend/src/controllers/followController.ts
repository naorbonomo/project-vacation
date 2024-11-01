// backend/controllers/followController.ts
import express, { Request, Response, NextFunction } from 'express';
import { FollowService } from '../services/followService';
import FollowModel from '../models/followModel';
import { appConfig } from '../utils/appConfig';
import { StatusCode } from "../models/statusEnum";
import { ValidationError } from '../models/exceptions';

const followService = new FollowService();
export const followRouter = express.Router();

// Follow a vacation
followRouter.post(appConfig.routePrefix + "/follow", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followData = new FollowModel(req.body);
        followData.validate(); // Validate the data

        await followService.followVacation(followData);
        res.status(StatusCode.Created).json({ message: 'Vacation followed successfully' });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(StatusCode.BadRequest).json({ error: error.message });
        } else {
            console.error('Error following vacation:', error);
            res.status(StatusCode.ServerError).json({ error: 'Internal server error' });
        }
    }
});

// Unfollow a vacation
followRouter.post(appConfig.routePrefix + "/unfollow", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followData = new FollowModel(req.body);
        followData.validate(); // Validate the data

        await followService.unfollowVacation(followData);
        res.status(StatusCode.Ok).json({ message: 'Vacation unfollowed successfully' });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(StatusCode.BadRequest).json({ error: error.message });
        } else {
            console.error('Error unfollowing vacation:', error);
            res.status(StatusCode.ServerError).json({ error: 'Internal server error' });
        }
    }
});

// Get all followed vacations for a user
followRouter.get(appConfig.routePrefix + "/followed-vacations/:userId", async (req: Request, res: Response) => {
    try {
        console.log("Fetching followed vacations for user");
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const followedVacations = await followService.getFollowedVacations(userId);
        console.log("Followed vacations for user:", followedVacations);
        res.status(200).json(followedVacations);
    } catch (error) {
        console.error('Error fetching followed vacations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
