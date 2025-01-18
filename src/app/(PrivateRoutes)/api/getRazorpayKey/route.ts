// /src/app/api/getRazorpayKey/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const razorpayKey = process.env.RAZORPAY_CLIENT_ID;

  if (!razorpayKey) {
    console.error('RAZORPAY_CLIENT_ID not found');
    return NextResponse.json({ error: 'Razorpay Client ID is not set in environment variables' }, { status: 500 });
  }

  return NextResponse.json({ key: razorpayKey }, { status: 200 });
}
