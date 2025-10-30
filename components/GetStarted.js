"use client"
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useAuth } from "@clerk/clerk-react";
import Link from 'next/link'

export const GetStarted = () => {
  const { openSignIn } = useClerk()
  const { isLoaded, isSignedIn } = useAuth()

  const handleSignUpClick = () => {
    setTimeout(() => {
      openSignIn({redirectUrl:"/dashboard"})
    }, 300)
  }

  if (isLoaded && isSignedIn) {
    return <Link className="mt-4" href="/dashboard"><Button>Get Started <ArrowRight /></Button></Link>
  }

  return <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={handleSignUpClick} className="mt-4">Get Started <ArrowRight /></Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Completely free as it is in beta mode ; )</p>
    </TooltipContent>
  </Tooltip>
}