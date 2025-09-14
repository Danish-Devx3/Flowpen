import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { prisma } from "@repo/prisma-db/client";


const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

function cheackUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userid) {
      return null;
    }

    return decoded.userid;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = cheackUser(token);
  if (userId == null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    const parseData = JSON.parse(data.toString());

    if (parseData.type === "join_room") {
      const user = users.find((user) => user.ws === ws);
      user?.rooms.push(parseData.roomId);
    }

    if (parseData.type === "leave_room") {
      const user = users.find((user) => user.ws === ws);

      if (!user) return;

      user.rooms = user.rooms.filter((room) => room !== parseData.roomId);
    }

    if (parseData.type === "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;

      await prisma.chat.create({
        data: {
            roomId,
            message,
            userId
        }
      })

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              userId: userId,
            })
          );
        }
      });
    }
  });
});
