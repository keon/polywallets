import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.predexon.com/v2/polymarket";
const API_KEY = process.env.PREDEXON_API_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conditionId = searchParams.get("condition_id");
  if (!conditionId) {
    return NextResponse.json({ error: "condition_id required" }, { status: 400 });
  }
  const url = new URL(`${API_BASE}/leaderboard/market/${conditionId}`);
  searchParams.forEach((value, key) => {
    if (key !== "condition_id") url.searchParams.set(key, value);
  });
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": API_KEY },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
