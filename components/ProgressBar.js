"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

export const ProgressBar = ({ progress }) => {
    return <Progress value={progress} className="w-full" />
}