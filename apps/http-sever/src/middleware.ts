import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./conf";


export function middlware(req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? ""


    const decoded = jwt.verify(token, JWT_SECRET)

    if(decoded){
        req.userid = decoded.userid
        next()
        
    } else{
        res.status(403).json({
            message: "Unauthorized"
        })
    }

}