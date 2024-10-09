// backend/controllers/vacationController.ts

import express, { Request, Response, NextFunction } from "express";
import { ValidationError, NotFoundError } from '../models/exceptions';
import multer from 'multer';
// import { upload } from '../utils/uploadConfig';

import { StatusCode } from "../models/statusEnum";
import { appConfig } from "../utils/appConfig"; 
import { createVacation, deleteVacation, getAllVacations, getVacationById, getVacationsWithFollowers, updateVacation } from "../services/vacationService";
import { uploadFileToS3 } from "../utils/s3Utils";

export const vacationRouter = express.Router();
// const upload = multer();
const upload = multer({ storage: multer.memoryStorage() });


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
  
        const vacation = await createVacation({
          destination,
          description,
          price: price ? parseFloat(price) : undefined,
          start_date: startDate ? new Date(startDate) : undefined,
          end_date: endDate ? new Date(endDate) : undefined,
        }, req.file);
  
        res.status(201).json({ message: 'Vacation created successfully', vacation });
      } catch (error) {
        console.error('Error creating vacation:', error);
        if (error instanceof Error) {
          res.status(400).json({ message: 'Validation error', error: error.message });
        } else {
          res.status(StatusCode.ServerError).json({ message: 'Error creating vacation', error: 'Unknown error' });
        }
      }
    }
  );

// delete a vacation
// Delete a vacation
vacationRouter.delete(
    appConfig.routePrefix + "/vacations/:id", 
    async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id, 10);
            
            if (isNaN(id)) {
                console.error('Invalid vacation ID:', req.params.id);
                return res.status(StatusCode.BadRequest).json({ message: 'Invalid vacation ID' });
            }

            console.log(`Deleting vacation with ID: ${id}`);
            await deleteVacation(id);
            res.status(StatusCode.NoContent).send();
        } catch (error) {
            console.error('Error deleting vacation:', error);
            if (error instanceof NotFoundError) {
                res.status(StatusCode.NotFound).json({ message: error.message });
            } else {
                res.status(StatusCode.ServerError).json({ message: 'Error deleting vacation', error: error });
            }
        }
    }
);


// update a vacation
vacationRouter.put(
    '/api/vacations/:id',
    upload.single('image'),
    async (req: Request, res: Response) => {
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
          start_date: req.body.startDate,
          end_date: req.body.endDate,
          price: parseFloat(req.body.price),
        }, req.file);
  
        res.status(StatusCode.Ok).json(updatedVacation);
      } catch (error) {
        console.error('Error updating vacation:', error);
        res.status(StatusCode.ServerError).json({ message: 'Error updating vacation', error: error });
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

// Get all vacations with followers count
vacationRouter.get(appConfig.routePrefix + "/vacations-with-followers", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Fetching vacations with followers count');
        const vacations = await getVacationsWithFollowers();
        console.log('Vacations with followers fetched:', vacations);
        res.status(StatusCode.Ok).json(vacations);
    } catch (error) {
        console.error('Error fetching vacations with followers:', error);
        res.status(StatusCode.ServerError).send("Error. Please try again later");
    }
});
