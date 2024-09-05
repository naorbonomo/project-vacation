"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class FollowModel {
    constructor(follow) {
        this.userId = follow.userId;
        this.vacationId = follow.vacationId;
    }
    validate() {
        const res = FollowModel.validateSchema.validate(this);
        if (res.error) {
            throw new exceptions_1.ValidationError(res.error.details[0].message);
        }
    }
}
FollowModel.validateSchema = joi_1.default.object({
    userId: joi_1.default.number().required().positive(),
    vacationId: joi_1.default.number().required().positive(),
});
exports.default = FollowModel;
