import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='border flex justify-between items-center px-4 sticky top-0 backdrop-blur-sm bg-white/30 h-[6vh]'>
      <p className='font-semibold text-lg'>ShareMy.Recipies</p><Link target='_blank' href="https://www.github.com" ><Github /></Link>
    </div>
  )
}

export default Navbar