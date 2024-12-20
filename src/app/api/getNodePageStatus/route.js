import { NextResponse } from 'next/server';

export async function GET() {
  let status = process.env.NODES_PAGE_STATUS === 'false' ? false : true;

  if (!status) {
    status = false
  }

  return NextResponse.json({ key: status }, { status: 200 });
}
