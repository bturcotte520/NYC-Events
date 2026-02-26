export interface NYCEvents {
  event_id: string;
  event_name: string;
  start_date_time: string;
  end_date_time: string;
  event_type: string;
  event_borough: string;
  event_location: string;
}

export const EVENT_TYPE_COLORS: Record<string, string> = {
  "Music": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Art": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Dance": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Film": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Theater": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Sports": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Community": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Kids": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Default": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export const BOROUGH_COLORS: Record<string, string> = {
  "Manhattan": "from-purple-500 to-blue-500",
  "Brooklyn": "from-orange-500 to-red-500",
  "Queens": "from-emerald-500 to-teal-500",
  "Bronx": "from-yellow-500 to-orange-500",
  "Staten Island": "from-cyan-500 to-blue-500",
};

export const EXCLUDED_EVENT_TYPES = [
  "Sport - Youth",
  "Sport - Adult",
  "Theater Load in and Load Outs",
  "Miscellaneous",
  "Outdoor Learning",
  "RIPA Special Event",
  "Kids Sports After-School",
];

export const EXCLUDED_EVENT_NAME_PATTERNS = [
  "Lawn Closure",
  "Closure",
  "Picnic House",
  "Miscellaneous",
  "construction",
  "Maintenance",
  "aftercare",
  "No Amplified Sound",
  "Model Helicopter",
  "Model Aircraft",
  "Radio Control Model",
  "Helen Marshall Playground",
  "Dana Discovery Center Lawn",
  "East Green",
];

export function getEventTypeColor(eventType: string): string {
  if (!eventType) return EVENT_TYPE_COLORS["Default"];

  const normalizedType = Object.keys(EVENT_TYPE_COLORS).find(key =>
    eventType.toLowerCase().includes(key.toLowerCase())
  );

  return normalizedType ? EVENT_TYPE_COLORS[normalizedType] : EVENT_TYPE_COLORS["Default"];
}

export function getBoroughGradient(borough: string): string {
  if (!borough) return "from-slate-500 to-slate-600";

  const normalizedBorough = Object.keys(BOROUGH_COLORS).find(key =>
    borough.toLowerCase().includes(key.toLowerCase())
  );

  return normalizedBorough ? BOROUGH_COLORS[normalizedBorough] : "from-slate-500 to-slate-600";
}

export function shouldExcludeEvent(event: NYCEvents): boolean {
  if (!event) return true;

  if (EXCLUDED_EVENT_TYPES.some(type =>
    event.event_type?.toLowerCase().includes(type.toLowerCase())
  )) {
    return true;
  }

  if (EXCLUDED_EVENT_NAME_PATTERNS.some(pattern =>
    event.event_name?.toLowerCase().includes(pattern.toLowerCase())
  )) {
    return true;
  }

  return false;
}
