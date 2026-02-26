import { NYCEvents, shouldExcludeEvent } from "./types";

const API_BASE_URL = "https://data.cityofnewyork.us/resource/tvpp-9vvx.json";

export interface FetchEventsParams {
  startDate?: Date;
  endDate?: Date;
  borough?: string;
  eventType?: string;
}

export async function fetchEvents(params: FetchEventsParams = {}): Promise<NYCEvents[]> {
  const queryParams = new URLSearchParams();
  
  queryParams.append("$limit", "5000");
  
  if (params.startDate) {
    queryParams.append(
      "$where",
      `start_date_time >= '${params.startDate.toISOString()}'`
    );
  }
  
  if (params.endDate && !params.startDate) {
    queryParams.append(
      "$where",
      `end_date_time <= '${params.endDate.toISOString()}'`
    );
  }
  
  if (params.startDate && params.endDate) {
    const existingWhere = queryParams.get("$where") || "";
    queryParams.set(
      "$where",
      `start_date_time >= '${params.startDate.toISOString()}' AND start_date_time <= '${params.endDate.toISOString()}'`
    );
  }
  
  if (params.borough) {
    const existingWhere = queryParams.get("$where") || "";
    if (existingWhere) {
      queryParams.set("$where", `${existingWhere} AND event_borough='${params.borough}'`);
    } else {
      queryParams.append("$where", `event_borough='${params.borough}'`);
    }
  }
  
  if (params.eventType) {
    const existingWhere = queryParams.get("$where") || "";
    if (existingWhere) {
      queryParams.set("$where", `${existingWhere} AND event_type='${params.eventType}'`);
    } else {
      queryParams.append("$where", `event_type='${params.eventType}'`);
    }
  }
  
  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: NYCEvents[] = await response.json();
  
  return data.filter(event => !shouldExcludeEvent(event));
}

export function groupEventsByDate(events: NYCEvents[]): Map<string, NYCEvents[]> {
  const grouped = new Map<string, NYCEvents[]>();
  
  events.forEach(event => {
    if (!event.start_date_time) return;
    
    const date = new Date(event.start_date_time);
    const dateKey = date.toISOString().split("T")[0];
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    
    grouped.get(dateKey)!.push(event);
  });
  
  return grouped;
}

export function getUniqueBoroughs(events: NYCEvents[]): string[] {
  const boroughs = new Set<string>();
  events.forEach(event => {
    if (event.event_borough) {
      boroughs.add(event.event_borough);
    }
  });
  return Array.from(boroughs).sort();
}

export function getUniqueEventTypes(events: NYCEvents[]): string[] {
  const types = new Set<string>();
  events.forEach(event => {
    if (event.event_type) {
      types.add(event.event_type);
    }
  });
  return Array.from(types).sort();
}
