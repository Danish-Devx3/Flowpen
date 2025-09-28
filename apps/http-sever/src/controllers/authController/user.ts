import { JWT_SECRET } from "@repo/be-common/config";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prisma } from "@repo/prisma-db/client";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";

export const userSignup = async (req: Request, res: Response) => {
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
}


export const userSignin = async (req: Request, res: Response) => {
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

  res.cookie('token', token, {
  httpOnly: true,
  secure: false,        // Set to false for http://localhost
  sameSite: 'lax',      // Try 'lax' instead of 'strict' for dev
  maxAge: 24 * 60 * 60 * 1000
});

  res.json({ token });
};

export const getUserRooms = async (req: Request, res: Response) => {
  const userId = req.userid!;
  try {
    const rooms = await prisma.room.findMany({
      where: {
        adminId: userId
      }
    });

    res.json({ rooms });

    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
    console.log(error);
    return;
  }
}