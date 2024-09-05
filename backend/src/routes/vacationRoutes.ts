// backend/src/routes/vacationRoutes.ts

import express from 'express';
import { VacationController } from '../controllers/vacationController';
import { upload } from '../utils/uploadConfig';

// const router = express.Router();

// export function createVacationRoutes(vacationController: VacationController) {
//     // ... other routes ...

//     // Route for creating a new vacation with image upload
//     router.post('/create', upload.single('image'), vacationController.createVacation);

//     // Route for updating a vacation with possible image upload
//     router.put('/update/:id', upload.single('image'), vacationController.updateVacation);

//     // ... other routes ...

//     return router;
// }