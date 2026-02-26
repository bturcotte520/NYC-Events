import { NextRequest, NextResponse } from "next/server";
import { NYCEvents, shouldExcludeEvent } from "@/lib/types";

const API_BASE_URL = "https://data.cityofnewyork.us/resource/tvpp-9vvx.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const borough = searchParams.get("borough");
  const eventType = searchParams.get("eventType");
  
  const queryParams = new URLSearchParams();
  queryParams.append("$limit", "5000");
  
  let whereClause = "";
  
  if (startDate && endDate) {
    whereClause = `start_date_time >= '${startDate}' AND start_date_time <= '${endDate}'`;
  } else if (startDate) {
    whereClause = `start_date_time >= '${startDate}'`;
  } else if (endDate) {
    whereClause = `end_date_time <= '${endDate}'`;
  }
  
  if (borough) {
    whereClause = whereClause 
      ? `${whereClause} AND event_borough='${borough}'`
      : `event_borough='${borough}'`;
  }
  
  if (eventType) {
    whereClause = whereClause
      ? `${whereClause} AND event_type='${eventType}'`
      : `event_type='${eventType}'`;
  }
  
  if (whereClause) {
    queryParams.append("$where", whereClause);
  }
  
  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data: NYCEvents[] = await response.json();
    const filtered = data.filter(event => !shouldExcludeEvent(event));
    
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    );
  }
}
