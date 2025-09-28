import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { middleware } from "./middlewares/authMiddleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";

import { prisma } from "@repo/prisma-db/client";
import userRoute from "./routes/userRoute";
import cors from "cors"

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3002",
  credentials: true,
}));

app.use("/", userRoute);



app.post("/room", middleware, async (req, res) => {
  const parseData = CreateRoomSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  const userId = req.userid!;

  try {
    const room = await prisma.room.create({
      data: {
        slug: parseData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomid: room.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const messages = await prisma.chat.findMany({
    where: {
      roomId: Number(roomId),
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.json({ messages });
  } catch (error) {
    res.status(404).json({
      message: "Room not found",
    });
  }
});

app.get("/room/:slug", async (req, res)=>{
  const slug = req.params.slug;

  const room = await prisma.room.findFirst({
    where: {
      slug,
    },
  });

  res.status(200).json({room})
})

app.listen(3001, () => {
  console.log("http runnig!");
});
