import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { prisma } from "@repo/prisma-db/client";

declare global {
  namespace Express {
    interface Request {
      userid?: string;
    }
  }
}


export async function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }

    if (typeof decoded === "object" && "userid" in decoded) {
        req.userid = (decoded as jwt.JwtPayload).userid as string
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}