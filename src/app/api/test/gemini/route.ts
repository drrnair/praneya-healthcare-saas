import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Google Gemini AI Test Endpoint",
    status: "ready",
    configured: process.env.GOOGLE_AI_API_KEY !== "your-gemini-api-key"
  });
}
