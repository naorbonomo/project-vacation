"use strict";
// backend/controllers/vacationController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationRouter = void 0;
const express_1 = __importDefault(require("express"));
const exceptions_1 = require("../models/exceptions");
const multer_1 = __importDefault(require("multer"));
// import { upload } from '../utils/uploadConfig';
const statusEnum_1 = require("../models/statusEnum");
const appConfig_1 = require("../utils/appConfig");
const vacationService_1 = require("../services/vacationService");
exports.vacationRouter = express_1.default.Router();
// const upload = multer();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// get all vacations
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching all vacations');
        const vacations = yield (0, vacationService_1.getAllVacations)();
        console.log('Vacations fetched:', vacations);
        res.status(statusEnum_1.StatusCode.Ok).json(vacations);
    }
    catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(statusEnum_1.StatusCode.ServerError).send("Error. Please try again later");
    }
}));
// create a vacation
exports.vacationRouter.post(appConfig_1.appConfig.routePrefix + "/vacations", upload.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);
        const { destination, description, price, startDate, endDate } = req.body;
        const vacation = yield (0, vacationService_1.createVacation)({
            destination,
            description,
            price: price ? parseFloat(price) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, req.file);
        res.status(201).json({ message: 'Vacation created successfully', vacation });
    }
    catch (error) {
        console.error('Error creating vacation:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: 'Validation error', error: error.message });
        }
        else {
            res.status(statusEnum_1.StatusCode.ServerError).json({ message: 'Error creating vacation', error: 'Unknown error' });
        }
    }
}));
// delete a vacation
exports.vacationRouter.delete(appConfig_1.appConfig.routePrefix + "/vacations/:id", 
// verifyTokenAdminMW
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid vacation ID' });
        }
        yield (0, vacationService_1.deleteVacation)(id);
        res.status(statusEnum_1.StatusCode.NoContent).send();
    }
    catch (error) {
        console.error('Error deleting vacation:', error);
        if (error instanceof exceptions_1.NotFoundError) {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(statusEnum_1.StatusCode.ServerError).json({ message: 'Error deleting vacation', error: error.message });
        }
    }
}));
// update a vacation
exports.vacationRouter.put(appConfig_1.appConfig.routePrefix + "/vacations/:id", upload.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid vacation ID' });
        }
        console.log('Received update data:', req.body);
        console.log('Received file:', req.file);
        const updatedVacation = yield (0, vacationService_1.updateVacation)(id, {
            destination: req.body.destination,
            description: req.body.description,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            imageUrl: req.file ? req.file.filename : undefined
        });
        res.status(statusEnum_1.StatusCode.Ok).json(updatedVacation);
    }
    catch (error) {
        console.error('Error updating vacation:', error);
        if (error instanceof exceptions_1.NotFoundError) {
            res.status(404).json({ message: error.message });
        }
        else if (error instanceof exceptions_1.ValidationError) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(statusEnum_1.StatusCode.ServerError).json({ message: 'Error updating vacation', error: error.message });
        }
    }
}));
// get a vacation by ID
exports.vacationRouter.get(appConfig_1.appConfig.routePrefix + "/vacations/:id", 
// verifyTokenMW
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid vacation ID' });
        }
        const vacation = yield (0, vacationService_1.getVacationById)(id);
        res.status(statusEnum_1.StatusCode.Ok).json(vacation);
    }
    catch (error) {
        console.error('Error fetching vacation:', error);
        if (error instanceof exceptions_1.NotFoundError) {
            res.status(statusEnum_1.StatusCode.NotFound).json({ message: error.message });
        }
        else {
            res.status(statusEnum_1.StatusCode.ServerError).json({ message: 'Error fetching vacation', error: error.message });
        }
    }
}));
