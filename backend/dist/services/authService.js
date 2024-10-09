"use strict";
// backend/src/services/authService.ts
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
exports.createUser = createUser;
exports.login = login;
const dal_1 = __importDefault(require("../DB/dal"));
const exceptions_1 = require("../models/exceptions");
const userModel_1 = __importDefault(require("../models/userModel"));
const authUtils_1 = require("../utils/authUtils");
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        user.validate();
        const hashedPassword = yield (0, authUtils_1.encryptPassword)(user.password);
        // user.password = hashedPassword;
        let q = `INSERT INTO users (first_name, last_name, email, password) 
             VALUES (?, ?, ?, ?);`;
        const params = [user.first_name, user.last_name, user.email, hashedPassword];
        yield (0, dal_1.default)(q, params);
        q = `SELECT user_id FROM users WHERE email=?;`;
        const res = yield (0, dal_1.default)(q, [user.email]);
        const id = res[0].id;
        user.id = id;
        user.token = (0, authUtils_1.createToken)(user);
        q = `UPDATE users SET token=? WHERE user_id=?;`;
        yield (0, dal_1.default)(q, [user.token, user.id]);
        return user.token;
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let q = `SELECT * FROM users WHERE email=?;`;
        const res = yield (0, dal_1.default)(q, [email]);
        if (res.length === 0 || !(yield (0, authUtils_1.validatePassword)(password, res[0].password))) {
            throw new exceptions_1.UnauthorizedError("Wrong credentials");
        }
        const user = new userModel_1.default(res[0]);
        if (!user.token) {
            user.token = (0, authUtils_1.createToken)(user);
            q = `UPDATE users SET token=? WHERE user_id=?;`;
            yield (0, dal_1.default)(q, [user.token, user.id]);
        }
        return user.token;
    });
}
