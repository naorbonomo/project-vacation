"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationController = void 0;
class VacationController {
    constructor(vacationService) {
        this.vacationService = vacationService;
        this.getAllVacations = async (req, res) => {
            try {
                console.log('Fetching all vacations');
                const vacations = await this.vacationService.getAllVacations();
                console.log('Vacations fetched:', vacations);
                res.json(vacations);
            } catch (error) {
                console.error('Error fetching vacations:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.createVacation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const vacationData = req.body;
                if (req.file) {
                    vacationData.imageFilename = req.file.filename;
                }
                else {
                    throw new Error('Image file is required');
                }
                console.log('Received vacation data:', vacationData);
                const newVacation = yield this.vacationService.createVacation(vacationData);
                res.status(201).json(newVacation);
            }
            catch (error) {
                console.error('Error creating vacation:', error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message, stack: error.stack });
                }
                else {
                    res.status(500).json({ error: 'An unexpected error occurred' });
                }
            }
        });
        this.updateVacation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedVacation = yield this.vacationService.updateVacation(parseInt(id), req.body, req.file);
                res.json(updatedVacation);
            }
            catch (error) {
                console.error('Error updating vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.deleteVacation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.vacationService.deleteVacation(parseInt(id));
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getVacationById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const vacation = yield this.vacationService.getVacationById(parseInt(id));
                if (vacation) {
                    res.json(vacation);
                }
                else {
                    res.status(404).json({ error: 'Vacation not found' });
                }
            }
            catch (error) {
                console.error('Error fetching vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.VacationController = VacationController;
