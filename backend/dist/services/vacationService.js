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
exports.VacationService = void 0;
class VacationService {
    constructor(pool) {
        this.pool = pool;
    }
    getAllVacations() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT * FROM vacations ORDER BY start_date ASC');
            return rows;
        });
    }
    createVacation(vacationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { destination, description, startDate, endDate, price, imageFilename } = vacationData;
            console.log('Creating vacation with data:', vacationData);
            if (!destination || !description || !startDate || !endDate || !price) {
                throw new Error('Missing required fields');
            }
            try {
                const [result] = yield this.pool.query('INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)', [destination, description, startDate, endDate, price, imageFilename]);
                console.log('Vacation created successfully:', result);
                return Object.assign({ id: result.insertId }, vacationData);
            }
            catch (error) {
                console.error('Database error:', error);
                if (error instanceof Error) {
                    throw new Error(`Failed to create vacation in database: ${error.message}`);
                }
                else {
                    throw new Error('Failed to create vacation in database');
                }
            }
        });
    }
    updateVacation(id, vacationData, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const { destination, description, start_date, end_date, price } = vacationData;
            let image_filename = undefined;
            if (image) {
                image_filename = image.filename;
            }
            const [result] = yield this.pool.query('UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = COALESCE(?, image_filename) WHERE vacation_id = ?', [destination, description, start_date, end_date, price, image_filename, id]);
            if (result.affectedRows === 0) {
                throw new Error('Vacation not found');
            }
            return this.getVacationById(id);
        });
    }
    deleteVacation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.query('DELETE FROM vacations WHERE vacation_id = ?', [id]);
            if (result.affectedRows === 0) {
                throw new Error('Vacation not found');
            }
        });
    }
    getVacationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT * FROM vacations WHERE vacation_id = ?', [id]);
            return rows[0];
        });
    }
}
exports.VacationService = VacationService;
