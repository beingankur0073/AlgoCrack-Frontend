import React, { useState } from 'react'
import backImg from "../assets/back.jpg";



const ChangePasswordDialog = ({setShowChangePasswordDialog}) => {
   
  
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        style={{
                backgroundImage: `url(${backImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
    >
         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-0" />
          <div className="bg-gradient-to-br from-green-900 via-stone-950 to-green-900 p-6 rounded-lg shadow-lg w-full max-w-sm z-20" >
            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
            <input type="password" placeholder="Old Password" className="w-full mb-3 p-2 rounded bg-gray-800 text-white" />
            <input type="password" placeholder="New Password" className="w-full mb-3 p-2 rounded bg-gray-800 text-white" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowChangePasswordDialog(false)} className="px-3 py-1 bg-gray-700 text-white rounded">Cancel</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
            </div>
          </div>
    </div>
  )
}

export default ChangePasswordDialog