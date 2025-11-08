// Simple test endpoint to verify Next.js API routes work
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Next.js API route is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
