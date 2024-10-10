// backend/src/models/vacationModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface VacationInterface {
    id?: number;
    destination: string;
    description: string;
    start_date: Date; // Matches the database field
    end_date: Date;   // Matches the database field
    price: number;
    image_filename: string;
    followersCount: number;
}

export default class VacationModel {
    constructor(
        public id?: number,
        public destination?: string,
        public description?: string,
        public start_date?: Date, // Matches the database field
        public end_date?: Date,   // Matches the database field
        public price?: number,
        public image_filename?: string,
        public followersCount?: number

    ) {}

    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(10).max(1000),
        start_date: Joi.date().required(), // Adjusted to match the property name
        end_date: Joi.date().required().min(Joi.ref('start_date')), // Adjusted to match the property name
        price: Joi.number().required().positive(),
        image_filename: Joi.string().optional().uri(),
    });

    validate(): void {
        const res = VacationModel.validateSchema.validate(this);
        if (res.error) {
            throw new ValidationError(res.error.details[0].message);
        }
    }
}
