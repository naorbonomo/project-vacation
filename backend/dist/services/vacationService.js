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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVacations = getAllVacations;
exports.createVacation = createVacation;
exports.deleteVacation = deleteVacation;
exports.updateVacation = updateVacation;
exports.getVacationById = getVacationById;
// import { s3Client } from "../utils/s3config";
const uuid_1 = require("uuid");
const exceptions_1 = require("../models/exceptions");
const vacationModel_1 = __importDefault(require("../models/vacationModel"));
const dal_1 = __importDefault(require("../DB/dal"));
const appConfig_1 = require("../utils/appConfig");
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
function getAllVacations() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Executing getAllVacations query');
        const q = 'SELECT * FROM vacations ORDER BY start_date ASC';
        const res = yield (0, dal_1.default)(q);
        console.log('Query result:', res);
        return res.map((v) => {
            const vacation = new vacationModel_1.default(v);
            vacation.imageUrl = v.image_filename ? `http://localhost:${appConfig_1.appConfig.port}/images/${v.image_filename}` : ''; //TODO change from localhost to the server address
            return vacation;
        });
    });
}
function createVacation(vacationData, file) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Received vacation data:', vacationData);
        const { destination, description, startDate, endDate, price } = vacationData;
        if (!destination)
            throw new exceptions_1.ValidationError('Missing required field: destination');
        if (!description)
            throw new exceptions_1.ValidationError('Missing required field: description');
        if (!startDate)
            throw new exceptions_1.ValidationError('Missing required field: startDate');
        if (!endDate)
            throw new exceptions_1.ValidationError('Missing required field: endDate');
        if (!price)
            throw new exceptions_1.ValidationError('Missing required field: price');
        let imageUrl = '';
        if (file) {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            try {
                yield s3.putObject(uploadParams).promise();
                imageUrl = `http://${process.env.AWS_S3_BUCKET_NAME}.s3-website-${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            }
            catch (error) {
                console.error('Error uploading file to S3:', error);
                throw new Error('Failed to upload image');
            }
        }
        console.log('Creating vacation with data:', Object.assign(Object.assign({}, vacationData), { imageUrl }));
        const q = `
      INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [destination, description, startDate, endDate, price, imageUrl];
        try {
            const result = yield (0, dal_1.default)(q, params);
            console.log('Vacation created successfully:', result);
            return Object.assign(Object.assign({ id: result.insertId }, vacationData), { imageUrl });
        }
        catch (error) {
            console.error('Database error:', error);
            throw new exceptions_1.ValidationError('Failed to create vacation in database: ' + error.message);
        }
    });
}
function deleteVacation(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Attempting to delete vacation with id: ${id}`);
        const q = 'DELETE FROM vacations WHERE vacation_id = ?';
        const params = [id];
        try {
            const result = yield (0, dal_1.default)(q, params);
            console.log('Delete operation result:', result);
            if (result.affectedRows === 0) {
                throw new exceptions_1.NotFoundError(`Vacation with id ${id} not found`);
            }
            console.log(`Vacation with id ${id} deleted successfully`);
        }
        catch (error) {
            console.error('Error deleting vacation:', error);
            if (error instanceof exceptions_1.NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to delete vacation: ${error.message}`);
        }
    });
}
function updateVacation(id, vacationData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Attempting to update vacation with id: ${id}`);
        console.log('Update data received:', vacationData);
        const updates = [];
        const params = [];
        if (vacationData.destination !== undefined) {
            updates.push('destination = ?');
            params.push(vacationData.destination);
        }
        if (vacationData.description !== undefined) {
            updates.push('description = ?');
            params.push(vacationData.description);
        }
        if (vacationData.startDate !== undefined) {
            updates.push('start_date = ?');
            params.push(vacationData.startDate);
        }
        if (vacationData.endDate !== undefined) {
            updates.push('end_date = ?');
            params.push(vacationData.endDate);
        }
        if (vacationData.price !== undefined) {
            updates.push('price = ?');
            params.push(vacationData.price);
        }
        if (vacationData.imageUrl !== undefined) {
            updates.push('image_url = ?');
            params.push(vacationData.imageUrl);
        }
        if (updates.length === 0) {
            console.log('No fields to update');
            return getVacationById(id);
        }
        const q = `
        UPDATE vacations
        SET ${updates.join(', ')}
        WHERE vacation_id = ?
    `;
        params.push(id);
        try {
            const result = yield (0, dal_1.default)(q, params);
            console.log('Update operation result:', result);
            if (result.affectedRows === 0) {
                throw new exceptions_1.NotFoundError(`Vacation with id ${id} not found`);
            }
            // Fetch the updated vacation
            const updatedVacation = yield getVacationById(id);
            console.log(`Vacation with id ${id} updated successfully`);
            return updatedVacation;
        }
        catch (error) {
            console.error('Error updating vacation:', error);
            if (error instanceof exceptions_1.NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to update vacation: ${error.message}`);
        }
    });
}
function getVacationById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Fetching vacation with id: ${id}`);
        const q = 'SELECT * FROM vacations WHERE vacation_id = ?';
        const params = [id];
        try {
            const result = yield (0, dal_1.default)(q, params);
            if (result.length === 0) {
                throw new exceptions_1.NotFoundError(`Vacation with id ${id} not found`);
            }
            console.log(`Vacation with id ${id} fetched successfully`);
            return new vacationModel_1.default(result[0]);
        }
        catch (error) {
            console.error('Error fetching vacation:', error);
            if (error instanceof exceptions_1.NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to fetch vacation: ${error.message}`);
        }
    });
}
