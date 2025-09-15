"use client"
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("")

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: Number(id),
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }

  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((message, index) => (
        <div key={index} >{message.message}</div>
      ))}

      <input type="text" value={currentMessage} onChange={(e) => {
        setCurrentMessage(e.target.value);
      }} />

      <button onClick={()=>{
        socket?.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage,
        }))
        setCurrentMessage('')
      }} >Send</button>
    </div>
  );
}
