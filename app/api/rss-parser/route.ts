import { NextRequest, NextResponse } from "next/server";
import { parseRssFeedOnServer as parseRssFeed } from "./utils";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.text();

    const parsedFeed = await parseRssFeed(data, url);

    return NextResponse.json({ data: parsedFeed });
  } catch (error) {
    console.error("Error in RSS API route:", error);
    return NextResponse.json(
      { error: "Failed to parse RSS feed" },
      { status: 500 }
    );
  }
}
