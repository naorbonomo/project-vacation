"use strict";
// backend/src/utils/authUtils.ts
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
exports.verifyToken = verifyToken;
exports.createToken = createToken;
exports.encryptPassword = encryptPassword;
exports.validatePassword = validatePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    const userWithoutPassword = Object.assign({}, user);
    delete userWithoutPassword.password;
    // const options = {expiresIn: "3h"};
    const options = {};
    const token = jsonwebtoken_1.default.sign({ userWithoutPassword }, appConfig_1.appConfig.jwtSecrete, options);
    return token;
}
function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, 10);
    });
}
function validatePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
// const um = new UserModel({token: "", username: 'David', email: '123@123.com', password: "1234", isAdmin: false, id:4})
// console.log(createToken(um));
