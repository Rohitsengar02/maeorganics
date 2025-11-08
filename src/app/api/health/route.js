import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Next.js API is working',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasFirebaseKey: !!process.env.FIREBASE_PRIVATE_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  });
}
