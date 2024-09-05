"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationRouter = void 0;
const express_1 = __importDefault(require("express"));
const statusEnum_1 = require("../models/statusEnum"); // Assuming you have a status enum
const appConfig_1 = require("../utils/appConfig"); // Assuming you have some app configuration
const vacationService_1 = require("../services/vacationService");
exports.vacationRouter = express_1.default.Router();
// Get all vacations
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations", async (req, res, next) => {
    try {
        console.log('Fetching all vacations');
        const vacations = await (0, vacationService_1.getAllVacations)();
        console.log('Vacations fetched:', vacations);
        res.status(statusEnum_1.StatusCode.Ok).json(vacations);
    }
    catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(statusEnum_1.StatusCode.ServerError).send("Error. Please try again later");
    }
});
// // Create a new vacation
// vacationRouter.post(appConfig.routePrefix + "/vacations", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { title, description, price, startDate, endDate } = req.body;
//         const imageUrl = req.file ? `/images/${req.file.filename}` : null;
//         const vacation = await vacationService.createVacation({
//             destination: title, // Assuming 'title' is used as 'destination'
//             description,
//             price: parseFloat(price),
//             startDate: new Date(startDate),
//             endDate: new Date(endDate),
//             imageUrl
//         });
//         res.status(201).json({ message: 'Vacation created successfully', vacation });
//     } catch (error) {
//         console.error('Error creating vacation:', error);
//         res.status(StatusCode.ServerError).json({ message: 'Error creating vacation', error: (error as Error).message });
//     }
// });
// // Update a vacation
// vacationRouter.put(appConfig.routePrefix + "/vacations/:id", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const updatedVacation = await vacationService.updateVacation(parseInt(id), req.body, req.file);
//         res.status(StatusCode.Ok).json(updatedVacation);
//     } catch (error) {
//         console.error('Error updating vacation:', error);
//         res.status(StatusCode.ServerError).send("Error. Please try again later");
//     }
// });
// // Delete a vacation
// vacationRouter.delete(appConfig.routePrefix + "/vacations/:id", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         await vacationService.deleteVacation(parseInt(id));
//         res.status(StatusCode.NoContent).send();
//     } catch (error) {
//         console.error('Error deleting vacation:', error);
//         res.status(StatusCode.ServerError).send("Error. Please try again later");
//     }
// });
// // Get a vacation by ID
// vacationRouter.get(appConfig.routePrefix + "/vacations/:id", verifyTokenMW, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const vacation = await vacationService.getVacationById(parseInt(id));
//         if (vacation) {
//             res.status(StatusCode.Ok).json(vacation);
//         } else {
//             res.status(StatusCode.NotFound).json({ error: 'Vacation not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching vacation:', error);
//         res.status(StatusCode.ServerError).send("Error. Please try again later");
//     }
// });
// // Get public vacations
// vacationRouter.get(appConfig.routePrefix + "/public-vacations", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log('Fetching public vacations');
//         const vacations = await vacationService.getPublicVacations();
//         console.log('Public vacations fetched:', vacations);
//         res.status(StatusCode.Ok).json(vacations);
//     } catch (error) {
//         console.error('Error fetching public vacations:', error);
//         res.status(StatusCode.ServerError).send("Error. Please try again later");
//     }
// });
