// backend/src/middleware/authMiddlewares.ts

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/authUtils";

export function verifyTokenMW(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.substring(7) || "";
        const user = verifyToken(token);
        res.locals.user = user;
        next()
    } catch (error) {
        next(error);
    }
}

export function verifyTokenAdminMW(req: Request, res: Response, next: NextFunction) {
    try {
        
        const token = req.header("Authorization")?.substring(7) || "";        
        const user = verifyToken(token, true);
        res.locals.user = user;
        next()
    } catch (error) {
        next(error);
    }
}