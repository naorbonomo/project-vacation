// backend/src/models/vacationModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface VacationInterface {
    id?: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    imageUrl: string;
}

export default class VacationModel {
    constructor(
        public id?: number,
        public destination?: string,
        public description?: string,
        public startDate?: Date,
        public endDate?: Date,
        public price?: number,
        public imageUrl?: string | null // Add this line
    ) {}

    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        title: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(10).max(1000),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().min(Joi.ref('startDate')),
        price: Joi.number().required().positive(),
        imageUrl: Joi.string().required().uri(),
    })

    validate(): void {
        const res = VacationModel.validateSchema.validate(this)
        if (res.error) {
            throw new ValidationError(res.error.details[0].message)
        }
    }
}