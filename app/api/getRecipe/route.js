import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Upload to memories.ai -> Parse it -> Generate Recipe

export async function PUT(request) {
    const { videoUrl } = await request.json()

    const req = await fetch("https://api.memories.ai/serve/api/v1/upload_url", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "sk-a2132397c21ce6e32d2ca5c59283a21d"
        },
        body: new URLSearchParams({
            url: videoUrl,
            "callback": `${process.env.URL}/api/memories`
        })
    })

    const res = await req.json()
    if (!res.success) return NextResponse.json({ success: false })

    return NextResponse.json({ success: true, videoNo: res.data.videoNo })
}


export async function GET(request) {
    const videoNo = request.url.split("?")[1].split("=")[1]
    const isParsed = await redis.get(videoNo)
    if(!isParsed) return NextResponse.json({success: false})
    return NextResponse.json({ success: true })
}