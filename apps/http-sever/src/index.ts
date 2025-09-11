import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './conf';
import { middlware } from './middleware';

const app = express();

app.post("/signup", (req, res) => {
    res.json({
        userid: 1
    })
})

app.post("/signin", (req, res) => {
    const userid = 1
    jwt.sign({ userid}, JWT_SECRET)


})

app.post("/room", middlware, (req, res) => {
    res.json({
        roomid: 1
    })
})




app.listen(3001)