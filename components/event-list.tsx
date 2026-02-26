"use client";

import { format, parseISO } from "date-fns";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NYCEvents, getEventTypeColor, getBoroughGradient } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventListProps {
  events: NYCEvents[];
  selectedDate: Date | null;
  isLoading: boolean;
}

export function EventList({ events, selectedDate, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            <p className="text-slate-400 text-sm">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <Calendar className="h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            No events found
          </h3>
          <p className="text-slate-500 text-sm max-w-xs">
            {selectedDate
              ? `No events scheduled for ${format(selectedDate, "MMMM d, yyyy")}.`
              : "Select a date to view events."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-800 shrink-0">
        <h3 className="text-lg font-semibold text-slate-100">
          {selectedDate
            ? format(selectedDate, "MMMM d, yyyy")
            : `${events.length} Event${events.length === 1 ? "" : "s"}`
          }
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          {events.length} event{events.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-3">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: NYCEvents }) {
  const startDate = event.start_date_time
    ? parseISO(event.start_date_time)
    : null;
  const endDate = event.end_date_time
    ? parseISO(event.end_date_time)
    : null;

  const handleClick = () => {
    const dateStr = startDate ? format(startDate, "MMMM d, yyyy") : "";
    const searchQuery = encodeURIComponent(`${event.event_name} ${dateStr} NYC`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-200 group cursor-pointer"
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-slate-100 text-sm leading-tight group-hover:text-indigo-400 transition-colors">
            {event.event_name}
          </h4>
          {event.event_type && (
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${getEventTypeColor(event.event_type)}`}
            >
              {event.event_type}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0.5 space-y-1">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {startDate ? format(startDate, "h:mm a") : "TBD"}
            {endDate ? ` - ${format(endDate, "h:mm a")}` : ""}
          </span>
        </div>
        
        {event.event_location && (
          <div className="flex items-start gap-2 text-slate-400 text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{event.event_location}</span>
          </div>
        )}
        
        {event.event_borough && (
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${getBoroughGradient(event.event_borough)}`} />
            <span className="text-xs text-slate-500">{event.event_borough}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
