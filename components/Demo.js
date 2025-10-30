"use client"

import React from 'react'
import YouTube from 'react-youtube'

const Demo = () => {
  return (
    <div className="py-4 border-b flex flex-col items-center">
      <h2 className='font-bold text-3xl text-center'>Demo</h2>
      <YouTube className='mt-4' videoId="CmzKQ3PSrow" opts={{
        height: "270",
        width: "480"
      }} />
    </div>
  )
}

export default Demo