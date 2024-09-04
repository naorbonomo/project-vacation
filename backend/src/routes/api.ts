import express from 'express';
import multer from 'multer';
import { VacationController } from '../controllers/vacationController';
import { UserController } from '../controllers/userController';
import { FollowController } from '../controllers/followController';
import { authenticate, isAdmin } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Add this middleware before routes
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log('Received request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
};

export function createApiRouter(
  vacationController: VacationController,
  userController: UserController,
  followController: FollowController
) {
  const router = express.Router();

  router.use(logRequest);

  // Public routes
  router.get('/public-vacations', vacationController.getPublicVacations);
  router.post('/register', userController.register);
  router.post('/login', userController.login);

  // Protected routes
  router.get('/vacations', authenticate, vacationController.getAllVacations);
  router.post('/vacations', authenticate, isAdmin, upload.single('image'), vacationController.createVacation);
  router.get('/vacations/:id', authenticate, vacationController.getVacationById);
  router.put('/vacations/:id', authenticate, isAdmin, upload.single('image'), vacationController.updateVacation);
  router.delete('/vacations/:id', authenticate, isAdmin, vacationController.deleteVacation);

  // User routes
  router.get('/users', authenticate, isAdmin, userController.getAllUsers);

  // Follow routes
  router.post('/follow', authenticate, followController.followVacation);
  router.delete('/follow', authenticate, followController.unfollowVacation);

  return router;
}