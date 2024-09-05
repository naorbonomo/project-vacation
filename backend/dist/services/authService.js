"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.login = login;
const dal_1 = __importDefault(require("../db/dal"));
const exceptions_1 = require("../models/exceptions");
const userModel_1 = __importDefault(require("../models/userModel"));
const authUtils_1 = require("../utils/authUtils");
async function createUser(user) {
    user.validate();
    let q = `INSERT INTO user (username, password, email) 
            values ('${user.username}', '${user.password}', '${user.email}');`;
    await (0, dal_1.default)(q);
    q = `SELECT id FROM user WHERE email='${user.email}';`;
    const res = await (0, dal_1.default)(q);
    const id = res[0].id;
    user.id = id;
    user.token = (0, authUtils_1.createToken)(user);
    q = `UPDATE user SET token='${user.token}' WHERE id=${user.id};`;
    await (0, dal_1.default)(q);
    return user.token;
}
async function login(email, password) {
    let q = `SELECT * FROM user WHERE email=? AND password=?;`;
    const params = [email, password];
    const res = await (0, dal_1.default)(q, params);
    if (res.length === 0) {
        throw new exceptions_1.UnauthorizedError("wrong credentials");
    }
    const user = new userModel_1.default(res[0]);
    if (!user.token) {
        user.token = (0, authUtils_1.createToken)(user);
        q = `UPDATE user SET token='${user.token}' WHERE id=${user.id};`;
        await (0, dal_1.default)(q);
    }
    return user.token;
}
