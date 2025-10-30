import React from 'react'
import { GetStarted } from './GetStarted'

const Hero = () => {
  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center gap-4 border-b'>
      <p className='font-extrabold text-6xl'>Cooked something amazing?</p>
      <p className='font-semibold'>Upload or record your cooking video and let AI turn it into a perfectly written, shareable recipe!</p>
      <GetStarted/>
    </div>
  )
}

export default Hero