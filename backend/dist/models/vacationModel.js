"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class VacationModel {
    constructor(id, destination, description, startDate, endDate, price, imageUrl // Add this line
    ) {
        this.id = id;
        this.destination = destination;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
        this.imageUrl = imageUrl;
    }
    validate() {
        const res = VacationModel.validateSchema.validate(this);
        if (res.error) {
            throw new exceptions_1.ValidationError(res.error.details[0].message);
        }
    }
}
VacationModel.validateSchema = joi_1.default.object({
    id: joi_1.default.number().optional().positive(),
    title: joi_1.default.string().required().min(2).max(100),
    description: joi_1.default.string().required().min(10).max(1000),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required().min(joi_1.default.ref('startDate')),
    price: joi_1.default.number().required().positive(),
    imageUrl: joi_1.default.string().required().uri(),
});
exports.default = VacationModel;
