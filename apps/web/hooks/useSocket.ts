import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";


export function useSocket(){
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState<WebSocket>()

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJjbWZqazBnZXkwMDAwa3ZxYzVsOThiZjZqIiwiaWF0IjoxNzU3ODQ3ODY1fQ.m_OT5dJ5rShEwYFH2hC-7WV6YVrwok_qsbAXKRKzdsE`);
        ws.onopen = ()=>{
            setLoading(false)
            setSocket(ws)
        }
    }, []);

    return {loading, socket}
}