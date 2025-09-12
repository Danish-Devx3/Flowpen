import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";

declare global {
  namespace Express {
    interface Request {
      userid?: string;
    }
  }
}


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }

    if (typeof decoded === "object" && "userid" in decoded) {
        req.userid = (decoded as jwt.JwtPayload).userid as string;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}