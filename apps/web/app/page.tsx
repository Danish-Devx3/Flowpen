"use client"
import styles from "./page.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation"





export default function Home(){
  const [roomId, setRoomId] = useState("")

  const router = useRouter()

  return(
    <div className={styles.page}>
      <input type="text" onChange={(e) => setRoomId(e.target.value)} value={roomId} />

      <button onClick={() => router.push(`/room/${roomId}`)} >Join Room</button>
    </div>
  )
}