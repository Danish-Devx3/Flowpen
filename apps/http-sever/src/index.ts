import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/be-common/config';
import { middleware } from './middleware';
import {CreateUserSchema} from '@repo/common/types'

const app = express();

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body)
    if(!data.success){
        res.status(400).json({
            message: data.error
        })
    }
    res.json({
        userid: 1
    })
})

app.post("/signin", (req, res) => {
    const userid = 1
    jwt.sign({ userid}, JWT_SECRET)


})

app.post("/room", middleware, (req, res) => {
    res.json({
        roomid: 1
    })
})




app.listen(3001, ()=>{
    console.log("http runnig!")
})