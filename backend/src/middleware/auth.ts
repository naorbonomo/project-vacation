import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../utils/appConfig';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('Entire request:', req);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, appConfig.jwtSecrete, (err: any, user: any) => {
    console.log('Token verification result:', err ? 'Error' : 'Success');
    if (err) return res.sendStatus(403);
    
    req.user = user;
    next();
  });
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('User in isAdmin middleware:', req.user);
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    console.log('Access denied: User is not an admin');
    res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
};