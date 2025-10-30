import { Bot, Camera, Share } from 'lucide-react'
import React from 'react'

const HowItWorks = () => {
  return (
    <div className='border-b py-4'>
      <h2 className='font-bold text-3xl text-center'>How it works</h2>

      <div className='flex justify-around mt-4'>
        <div className='h-[30vh] w-[12vw] rounded-2xl border flex flex-col justify-center items-center p-4 gap-4'>
          <div className=''><Camera /></div>
          <p>You upload or record video</p>
        </div>
        <div className='h-[30vh] w-[12vw] rounded-2xl border flex flex-col justify-center items-center p-4 gap-4'>
          <div className=''><Bot /></div>
          <p>The AI processes the video and write recipe</p>
        </div>
        <div className='h-[30vh] w-[12vw] rounded-2xl border flex flex-col justify-center items-center p-4 gap-4'>
          <div className=''><Share /></div>
          <p>It gives you, now you can share it!</p>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks