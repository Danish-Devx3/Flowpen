import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema } from "@repo/common/types";

import { prisma } from "@repo/prisma-db/client";

const app = express();

app.post("/signup", (req, res) => {
  const parseData = CreateUserSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  try {
    prisma.user.create({
    data: {
      email: parseData.data.username,
      password: parseData.data.password,
      name: parseData.data.name,
    },
  });
  } catch (error) {
    res.status(411).json({
      message: "User already exists",
    })
  }
  
  res.json({
    userid: 1,
  });
});

app.post("/signin", (req, res) => {
  const userid = 1;
  jwt.sign({ userid }, JWT_SECRET);
});

app.post("/room", middleware, (req, res) => {
  res.json({
    roomid: 1,
  });
});

app.listen(3001, () => {
  console.log("http runnig!");
});
