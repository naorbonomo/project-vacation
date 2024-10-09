"use strict";
// backend/src/models/userModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class UserModel {
    constructor(user) {
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
        this.isAdmin = user.isAdmin;
        this.token = user.token;
    }
    validate() {
        const res = UserModel.validateSchema.validate(this);
        if (res.error) {
            throw new exceptions_1.ValidationError(res.error.details[0].message);
        }
    }
}
UserModel.validateSchema = joi_1.default.object({
    id: joi_1.default.number().optional().positive(),
    first_name: joi_1.default.string().required().min(2).max(50),
    last_name: joi_1.default.string().required().min(2).max(50),
    password: joi_1.default.string().required().min(4).max(15),
    email: joi_1.default.string().required().email(),
    role: joi_1.default.string().optional(),
    isAdmin: joi_1.default.boolean().optional(),
    token: joi_1.default.string().optional(),
});
exports.default = UserModel;
