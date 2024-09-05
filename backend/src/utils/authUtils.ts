// backend/src/utils/authUtils.ts

import bcrypt from 'bcrypt';
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import { appConfig } from "./appConfig";
import { AppExcption, UnauthorizedError } from "../models/exceptions";


export function verifyToken(token: string, adminRequired: boolean = false) {
    if (!token) {
        throw new UnauthorizedError("Missing Credentials!")
    }
    try {
        const res = jwt.verify(token, appConfig.jwtSecrete as string) as { userWithoutPassword: UserModel };
        if (adminRequired && !res.userWithoutPassword.isAdmin) {
            throw new UnauthorizedError("Only admin user has access!");
        }
        return res.userWithoutPassword

    } catch (error) {
        if (error instanceof AppExcption) {
            throw error;
        }
        throw new UnauthorizedError("ERROR: Wrong Credentials!");
    }
}

export function createToken(user: UserModel): string {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    // const options = {expiresIn: "3h"};
    const options = {};
    const token = jwt.sign({ userWithoutPassword }, appConfig.jwtSecrete as string, options)

    return token;
}

export async function encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// const um = new UserModel({token: "", username: 'David', email: '123@123.com', password: "1234", isAdmin: false, id:4})
// console.log(createToken(um));
