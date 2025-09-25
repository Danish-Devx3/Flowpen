import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

type Shape = "circle" | "rect" | "pencil";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");

  useEffect(()=>{

    //@ts-ignore
    window.selectedTool = selectedTool;
  })
  
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  });

  return (
    <div className="h-[100vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (e: Shape) => void;
}) {
  return (
    <div className="fixed top-10 left-30">
      <div className="flex gap-4">
        <IconButton
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool("pencil");
          }}
        />
        <IconButton
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
          onClick={() => {
            setSelectedTool("rect");
          }}
        />
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle />}
          onClick={() => {
            setSelectedTool("circle");
          }}
        />
      </div>
    </div>
  );
}
