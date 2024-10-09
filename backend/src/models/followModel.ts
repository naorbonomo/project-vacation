// backend/src/models/followModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface FollowInterface {
    user_id: number;
    vacation_id: number;
}

export default class FollowModel {
    user_id: number;
    vacation_id: number;

    constructor(follow: FollowInterface) {
        this.user_id = follow.user_id;
        this.vacation_id = follow.vacation_id;
    }

    private static validateSchema = Joi.object({
        user_id: Joi.number().required().positive(),
        vacation_id: Joi.number().required().positive(),
    })

    validate(): void {
        const res = FollowModel.validateSchema.validate(this)
        if (res.error) {
            throw new ValidationError(res.error.details[0].message)
        }
    }
}