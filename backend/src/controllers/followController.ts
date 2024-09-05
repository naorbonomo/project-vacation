// backend/src/controllers/followController.ts

import { Request, Response } from 'express';
import { FollowService } from '../services/followService';

export class FollowController {
  constructor(private followService: FollowService) {}

  followVacation = async (req: Request, res: Response) => {
    try {
      const { userId, vacationId } = req.body;
      await this.followService.followVacation(userId, vacationId);
      res.status(201).json({ message: 'Vacation followed successfully' });
    } catch (error) {
      console.error('Error following vacation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  unfollowVacation = async (req: Request, res: Response) => {
    try {
      const { userId, vacationId } = req.body;
      await this.followService.unfollowVacation(userId, vacationId);
      res.status(200).json({ message: 'Vacation unfollowed successfully' });
    } catch (error) {
      console.error('Error unfollowing vacation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}