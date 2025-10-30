import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Hero = () => {
  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center gap-4 border-b'>
      <p className='font-extrabold text-6xl'>Cooked something amazing?</p>
      <p className='font-semibold'>Upload or record your cooking video and let AI turn it into a perfectly written, shareable recipe!</p>
      <Tooltip>
        <TooltipTrigger asChild><Button className="mt-4">Get Started <ArrowRight /></Button></TooltipTrigger>
        <TooltipContent>
          <p>Completely free as it is in beta mode ; )</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default Hero