import redis from "@/lib/redis"
import { NextResponse } from "next/server"


export async function POST(request) {
    const payload = await request.json()
    if(payload.status == "PARSE"){
        await redis.set(payload.video_no, true) // In future, add expiration
    }
    return NextResponse.json({success: true})
}