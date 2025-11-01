import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Upload to memories.ai -> Parse it -> Generate Recipe

export async function PUT(request) {
    const { videoUrl } = await request.json()

    const req = await fetch("https://api.memories.ai/serve/api/v1/upload_url", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": process.env.MEMORIES_AI_API_KEY
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
    if (!isParsed) return NextResponse.json({ success: false })
    return NextResponse.json({ success: true })
}


export async function POST(request) {
    const { videoNo } = await request.json()

    // Using Chat API to chat with ai and generate shareable Recipe.
    const req = await fetch("https://api.memories.ai/serve/api/v1/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.MEMORIES_AI_API_KEY
        },
        body: JSON.stringify({
            video_nos: [videoNo],
            prompt: `Analyze the provided cooking video in detail — including both its visuals and audio — to extract a complete, precise recipe that accurately replicates the dish shown. Present the recipe in Markdown format with the following sections:\nIngredients: List all ingredients with exact quantities and units.\nEquipment: List all tools, appliances, and utensils used.\nInstructions: Provide clear, numbered, step-by-step directions with precise timings, temperatures, and techniques as demonstrated in the video.\n\nEnsure every detail is faithful to what appears and is said in the video. Output only the formatted recipe — no commentary or additional text.`
        })
    })

    const res = await req.json()

    if (!res.success) return NextResponse.json({ success: false })
    console.log(res.data.content)

    return NextResponse.json({ success: true, recipe: res.data.content })
}