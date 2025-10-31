import { NextResponse } from "next/server"


export async function POST(request) {
    const payload = await request.json()
    console.log(payload)
    return NextResponse.json({success: true})
}