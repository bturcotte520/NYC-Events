import { NextRequest, NextResponse } from "next/server";
import { NYCEvents, shouldExcludeEvent } from "@/lib/types";

const API_BASE_URL = "https://data.cityofnewyork.us/resource/tvpp-9vvx.json";

function formatDateForSocrata(date: Date): string {
  return date.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const borough = searchParams.get("borough");
  const eventType = searchParams.get("eventType");
  
  const queryParams = new URLSearchParams();
  queryParams.append("$limit", "5000");
  
  const whereConditions: string[] = [];
  
  if (startDate) {
    const start = new Date(startDate);
    whereConditions.push(`start_date_time >= '${formatDateForSocrata(start)}'`);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    whereConditions.push(`start_date_time <= '${formatDateForSocrata(end)}'`);
  }
  
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
    const filtered = data.filter(event => !shouldExcludeEvent(event));
    
    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    );
  }
}
