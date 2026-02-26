import { NYCEvents, shouldExcludeEvent } from "./types";

export interface FetchEventsParams {
  startDate?: Date;
  endDate?: Date;
  borough?: string;
  eventType?: string;
}

export async function fetchEvents(params: FetchEventsParams = {}): Promise<NYCEvents[]> {
  const queryParams = new URLSearchParams();
  
  if (params.borough) {
    queryParams.append("borough", params.borough);
  }
  
  if (params.eventType) {
    queryParams.append("eventType", params.eventType);
  }
  
  const url = `/api/events?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  const data: NYCEvents[] = await response.json();
  return data;
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
