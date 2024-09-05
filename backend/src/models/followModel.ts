// backend/src/models/followModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface FollowInterface {
    userId: number;
    vacationId: number;
}

export default class FollowModel {
    userId: number;
    vacationId: number;

    constructor(follow: FollowInterface) {
        this.userId = follow.userId;
        this.vacationId = follow.vacationId;
    }

    private static validateSchema = Joi.object({
        userId: Joi.number().required().positive(),
        vacationId: Joi.number().required().positive(),
    })

    validate(): void {
        const res = FollowModel.validateSchema.validate(this)
        if (res.error) {
            throw new ValidationError(res.error.details[0].message)
        }
    }
}