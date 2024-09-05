"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVacations = getAllVacations;
const vacationModel_1 = __importDefault(require("../models/vacationModel"));
const dal_1 = __importDefault(require("../DB/dal"));
async function getAllVacations() {
    console.log('Executing getAllVacations query');
    const q = 'SELECT * FROM vacations ORDER BY start_date ASC';
    const res = await (0, dal_1.default)(q);
    console.log('Query result:', res);
    return res.map((v) => new vacationModel_1.default(v));
}
//   async getAllVacations(): Promise<VacationModel[]> {
//     console.log('Executing getAllVacations query');
//     const q = 'SELECT * FROM vacations ORDER BY start_date ASC';
//     const res = await this.runQuery(q);
//     console.log('Query result:', res);
//     return res.map((v: any) => new VacationModel(v));
//   }
//   async createVacation(vacationData: Partial<VacationModel>): Promise<VacationModel> {
//     const { destination, description, startDate, endDate, price, imageUrl } = vacationData;
//     if (!destination || !description || !startDate || !endDate || !price) {
//       throw new ValidationError('Missing required fields');
//     }
//     console.log('Creating vacation with data:', vacationData);
//     const q = `
//       INSERT INTO vacations (destination, description, start_date, end_date, price, image_url)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const params = [destination, description, startDate, endDate, price, imageUrl];
//     try {
//       const result = await this.runQuery(q, params) as any;
//       console.log('Vacation created successfully:', result);
//       return { id: result.insertId, ...vacationData } as VacationModel;
//     } catch (error) {
//       console.error('Database error:', error);
//       throw new ValidationError('Failed to create vacation in database');
//     }
//   }
//   async updateVacation(id: number, vacationData: Partial<VacationModel>, image?: Express.Multer.File): Promise<VacationModel> {
//     const { destination, description, start_date, end_date, price } = vacationData;
//     let image_filename = image ? image.filename : undefined;
//     const q = `
//       UPDATE vacations
//       SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = COALESCE(?, image_filename)
//       WHERE vacation_id = ?
//     `;
//     const params = [destination, description, start_date, end_date, price, image_filename, id];
//     const result = await this.runQuery(q, params) as any;
//     if (result.affectedRows === 0) {
//       throw new NotFoundError('Vacation not found');
//     }
//     return this.getVacationById(id);
//   }
//   async deleteVacation(id: number): Promise<void> {
//     const q = 'DELETE FROM vacations WHERE vacation_id = ?';
//     const params = [id];
//     const result = await this.runQuery(q, params) as any;
//     if (result.affectedRows === 0) {
//       throw new NotFoundError('Vacation not found');
//     }
//   }
//   async getVacationById(id: number): Promise<VacationModel | null> {
//     const q = 'SELECT * FROM vacations WHERE vacation_id = ?';
//     const params = [id];
//     const res = await this.runQuery(q, params);
//     if (res.length === 0) {
//       throw new NotFoundError('Vacation not found');
//     }
//     return new VacationModel(res[0]);
//   }
//   async getPublicVacations(): Promise<VacationModel[]> {
//     console.log('Executing getPublicVacations query');
//     const q = 'SELECT vacation_id, destination, description, start_date, end_date, price, image_filename FROM vacations ORDER BY start_date ASC';
//     const res = await this.runQuery(q);
//     console.log('Query result:', res);
//     return res.map((v: any) => new VacationModel(v));
//   }
// }
