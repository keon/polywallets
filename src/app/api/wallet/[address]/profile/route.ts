import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.predexon.com/v2/polymarket";
const API_KEY = process.env.PREDEXON_API_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const res = await fetch(`${API_BASE}/wallet/${address}`, {
    headers: { "x-api-key": API_KEY },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
