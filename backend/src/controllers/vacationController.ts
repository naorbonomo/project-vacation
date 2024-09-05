// backend/controllers/vacationController.ts

import express, { Request, Response, NextFunction } from "express";
import { ValidationError, NotFoundError } from '../models/exceptions';
import multer from 'multer';
import { upload } from '../utils/uploadConfig';

import { StatusCode } from "../models/statusEnum";
import { appConfig } from "../utils/appConfig"; 
import { createVacation, deleteVacation, getAllVacations, getVacationById, updateVacation } from "../services/vacationService";

export const vacationRouter = express.Router();
// const upload = multer();

// get all vacations
vacationRouter.get(appConfig.routePrefix + "/vacations",  async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Fetching all vacations');
        const vacations = await getAllVacations();
        console.log('Vacations fetched:', vacations);
        res.status(StatusCode.Ok).json(vacations);
    } catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(StatusCode.ServerError).send("Error. Please try again later");
    }
});

// create a vacation
vacationRouter.post(
    appConfig.routePrefix + "/vacations", 
    upload.single('image'), 
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);

        const { destination, description, price, startDate, endDate } = req.body;
        const imageUrl = req.file ? req.file.filename : '';

        const vacation = await createVacation({
            destination, 
            description,
            price: price ? parseFloat(price) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            imageUrl
        });

        res.status(201).json({ message: 'Vacation created successfully', vacation });
    } catch (error) {
        console.error('Error creating vacation:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: 'Validation error', error: error.message });
        } else {
            res.status(StatusCode.ServerError).json({ message: 'Error creating vacation', error: 'Unknown error' });
        }
    }
});

// delete a vacation
vacationRouter.delete(
    appConfig.routePrefix + "/vacations/:id", 
    // verifyTokenAdminMW
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid vacation ID' });
            }

            await deleteVacation(id);
            res.status(StatusCode.NoContent).send();
        } catch (error) {
            console.error('Error deleting vacation:', error);
            if (error instanceof NotFoundError) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(StatusCode.ServerError).json({ message: 'Error deleting vacation', error: (error as Error).message });
            }
        }
    }
);

// update a vacation
vacationRouter.put(
    appConfig.routePrefix + "/vacations/:id",
    upload.single('image'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid vacation ID' });
        }

        console.log('Received update data:', req.body);
        console.log('Received file:', req.file);

        const updatedVacation = await updateVacation(id, {
            destination: req.body.destination,
            description: req.body.description,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            imageUrl: req.file ? req.file.filename : undefined
        });

        res.status(StatusCode.Ok).json(updatedVacation);
    } catch (error) {
            console.error('Error updating vacation:', error);
            if (error instanceof NotFoundError) {
                res.status(404).json({ message: error.message });
            } else if (error instanceof ValidationError) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(StatusCode.ServerError).json({ message: 'Error updating vacation', error: (error as Error).message });
            }
        }
    }
);

// get a vacation by ID
vacationRouter.get(
    appConfig.routePrefix + "/vacations/:id",
    // verifyTokenMW
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid vacation ID' });
            }

            const vacation = await getVacationById(id);
            res.status(StatusCode.Ok).json(vacation);
        } catch (error) {
            console.error('Error fetching vacation:', error);
            if (error instanceof NotFoundError) {
                res.status(StatusCode.NotFound).json({ message: error.message });
            } else {
                res.status(StatusCode.ServerError).json({ message: 'Error fetching vacation', error: (error as Error).message });
            }
        }
    }
);


