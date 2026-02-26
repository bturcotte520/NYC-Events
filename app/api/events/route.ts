import { NextRequest, NextResponse } from "next/server";
import { NYCEvents, shouldExcludeEvent } from "@/lib/types";

const API_BASE_URL = "https://data.cityofnewyork.us/resource/tvpp-9vvx.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const borough = searchParams.get("borough");
  const eventType = searchParams.get("eventType");
  
  const queryParams = new URLSearchParams();
  queryParams.append("$limit", "5000");
  
  const whereConditions: string[] = [];
  
  if (borough) {
    whereConditions.push(`event_borough='${borough}'`);
  }
  
  if (eventType) {
    whereConditions.push(`event_type='${eventType}'`);
  }
  
  if (whereConditions.length > 0) {
    queryParams.append("$where", whereConditions.join(" AND "));
  }
  
  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  
  console.log("Fetching from NYC API:", url);
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("NYC API error:", errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data: NYCEvents[] = await response.json();
    console.log(`Got ${data.length} events from API`);
    
    if (data.length > 0) {
      const dates = data.map(e => e.start_date_time).filter(Boolean).sort();
      console.log("Date range:", dates[0], "to", dates[dates.length - 1]);
    }
    
    const filtered = data.filter(event => !shouldExcludeEvent(event));
    console.log(`After filtering: ${filtered.length} events`);
    
    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    );
  }
}
