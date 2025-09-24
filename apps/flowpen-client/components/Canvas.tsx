import { initDraw } from "@/draw";
import React, { useEffect, useRef } from "react";

export default function Canvas({roomId, socket}:{roomId: string, socket: WebSocket}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  });

  return (
    <div className="">
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
    </div>
  );
}
