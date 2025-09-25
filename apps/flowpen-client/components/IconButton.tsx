import React, { ReactNode } from 'react'

function IconButton({icon, onClick, activated}:
    {
        icon: ReactNode,
        onClick: () => void,
        activated: boolean
    }
) {
  return (
    <div className={`cursor-pointer rounded-full border-2 border-white p-2 bg-black hover:bg-gray-500 ${activated ? "text-red-500" : "text-white"}`} onClick={onClick} >
      {icon}
    </div>
  )
}

export default IconButton
