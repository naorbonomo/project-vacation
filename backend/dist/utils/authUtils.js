"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appConfig_1 = require("./appConfig");
const exceptions_1 = require("../models/exceptions");
function verifyToken(token, adminRequired = false) {
    if (!token) {
        throw new exceptions_1.UnauthorizedError("Missing Credentials!");
    }
    try {
        const res = jsonwebtoken_1.default.verify(token, appConfig_1.appConfig.jwtSecrete);
        if (adminRequired && !res.userWithoutPassword.isAdmin) {
            throw new exceptions_1.UnauthorizedError("Only admin user has access!");
        }
        return res.userWithoutPassword;
    }
    catch (error) {
        if (error instanceof exceptions_1.AppExcption) {
            throw error;
        }
        throw new exceptions_1.UnauthorizedError("ERROR: Wrong Credentials!");
    }
}
function createToken(user) {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    // const options = {expiresIn: "3h"};
    const options = {};
    const token = jsonwebtoken_1.default.sign({ userWithoutPassword }, appConfig_1.appConfig.jwtSecrete, options);
    return token;
}
// const um = new UserModel({token: "", username: 'David', email: '123@123.com', password: "1234", isAdmin: false, id:4})
// console.log(createToken(um));
