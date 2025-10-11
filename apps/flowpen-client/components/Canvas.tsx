
import React, { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>()
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  

  useEffect(()=>{
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, socket, roomId);
      setGame(g)
      g.init()
      return () => {
        g.destroy()
      }
    }

  }, [canvasRef]);

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
  selectedTool: Tool;
  setSelectedTool: (e: Tool) => void;
}) {
  return (
    <div className="fixed top-10 left-30">
      <div className="flex gap-4">
        <IconButton
          activated={selectedTool === "pencil"}
          icon={<img className="invert" width="20" height="20" src="https://img.icons8.com/ios-filled/50/line.png" alt="line"/>}
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
