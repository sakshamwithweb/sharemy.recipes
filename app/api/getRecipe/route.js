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

    const recipeExtractionPrompt = `
Analyze the provided cooking video thoroughly — including both visuals and audio — to extract a complete, accurate, and detailed recipe that replicates the dish shown.

Present the output in **well-formatted Markdown**, with clear headings, bold text for emphasis, and proper spacing. Follow this exact structure:

# 🍽️ Recipe Title

## 🧂 Ingredients
List all ingredients with **exact quantities and units**, each on a new line.  
Format each as: **Ingredient Name** — quantity and unit.

## 🔧 Equipment
List all tools, appliances, and utensils used.  
Format each as a bulleted list with **bolded tool names**.

## 👩‍🍳 Instructions
Provide **numbered, step-by-step instructions**, each starting on a new line.  
Use **bold** for key actions (e.g., *Sauté*, *Boil*, *Mix*, *Simmer*) and include precise **timings**, **temperatures**, and **techniques** as demonstrated in the video.

Do **not** enclose the response in code blocks or triple backticks.  
The entire output must be plain Markdown text with headings, bold emphasis, and clear formatting — no commentary, no extra explanation.
`;


    // Using Chat API to chat with ai and generate shareable Recipe.
    const req = await fetch("https://api.memories.ai/serve/api/v1/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.MEMORIES_AI_API_KEY
        },
        body: JSON.stringify({
            video_nos: [videoNo],
            prompt: recipeExtractionPrompt
        })
    })

    const res = await req.json()

    if (!res.success) return NextResponse.json({ success: false })
    console.log(res.data.content)

    return NextResponse.json({ success: true, recipe: res.data.content })
}