// backend/src/routes/api.ts

import express from 'express';
import multer from 'multer';
import { UserController } from '../controllers/userController';
import { FollowController } from '../controllers/followController';
import { authenticate, isAdmin } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import { vacationRouter } from '../controllers/vacationController';


export function createApiRouter(
  userController: UserController,
  followController: FollowController

) {
  const router = express.Router();



  // Public routes
  router.post('/register', userController.register);
  router.post('/login', userController.login);
  router.get('/vacations', vacationRouter);

  // User routes
  router.get('/users', authenticate, isAdmin, userController.getAllUsers);

  // Follow routes
  router.post('/follow', authenticate, followController.followVacation);
  router.delete('/follow', authenticate, followController.unfollowVacation);

  return router;
}