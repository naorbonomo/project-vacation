import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { appConfig } from "./utils/appConfig";
import { logMW } from "./middleware/logMW";
import { upload } from './utils/uploadConfig'; // Update this import

import { createApiRouter } from './routes/api';
import { VacationService } from './services/vacationService';
import { VacationController } from './controllers/vacationController';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';
import { FollowService } from './services/followService';
import { FollowController } from './controllers/followController';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// log
app.use(logMW);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection pool
const pool = mysql.createPool(appConfig.dbConfig);

// Initialize services and controllers
const vacationService = new VacationService(pool);
const vacationController = new VacationController(vacationService);

const userService = new UserService(pool);
const userController = new UserController(userService);

const followService = new FollowService(pool);
const followController = new FollowController(followService);

// Serve static files from the uploads directory
app.use('/images', express.static(path.join(__dirname, '../uploads')));

// Set up API routes
const apiRouter = createApiRouter(vacationController, userController, followController);
app.use('/api', apiRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Check if uploads directory exists and create it if not
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Make sure this line is present to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});