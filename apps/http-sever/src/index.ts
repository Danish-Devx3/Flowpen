import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";

import { prisma } from "@repo/prisma-db/client";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parseData = CreateUserSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parseData.data.username,
        password: parseData.data.password,
        name: parseData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "User already exists",
    });
  }

  res.json({
    userid: 1,
  });
});

app.post("/signin", async (req, res) => {
  const parseData = SigninSchema.safeParse(req.body);

  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parseData.data.username,
      password: parseData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Not Authorized",
    });
    return;
  }

  const token = jwt.sign(
    {
      userid: user.id,
    },
    JWT_SECRET
  );

  res.json({ token });
});

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
