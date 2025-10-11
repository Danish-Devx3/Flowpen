"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJjbWczZzU4M2EwMDAwa3Y3Z3YyZ244c29yIiwiaWF0IjoxNzYwMTY0MTQxfQ.ucyE6ag5OqHJnm88UCW79KAKTx3FcmC_1eMwwUYW_gM`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId: Number(roomId)
      }))
    };
  }, []);


  if(!socket){
    return <div>Connecting to server</div>
  }

  return (
    <Canvas roomId={roomId} socket={socket} />
  );
}
