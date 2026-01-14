/* import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (role: 'client' | 'seller' | 'admin') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    }
} */