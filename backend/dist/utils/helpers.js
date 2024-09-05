"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbServerUp = isDbServerUp;
const dal_1 = __importDefault(require("../db/dal"));
async function isDbServerUp() {
    try {
        await (0, dal_1.default)("select 1;");
        return true;
    }
    catch (error) {
        return false;
    }
}
