import axios from 'axios'
import React, { useEffect } from 'react'

function page() {
    const userRooms = []
    

    useEffect(() => {
        (
            async () => {
                try {
                    const res = await axios.get("http://localhost:3001/user/rooms");
                } catch (error) {
                    console.log(error);
                }
            }
        )()
    })
    
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default page
