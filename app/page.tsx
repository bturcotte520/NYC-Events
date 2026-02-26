"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isWeekend,
  addDays,
} from "date-fns";
import { CalendarDays, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/calendar";
import { EventList } from "@/components/event-list";
import { Filters } from "@/components/filters";
import { fetchEvents, groupEventsByDate, getUniqueBoroughs, getUniqueEventTypes } from "@/lib/api";
import { NYCEvents } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [events, setEvents] = useState<NYCEvents[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<NYCEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const [selectedBorough, setSelectedBorough] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [isThisWeekend, setIsThisWeekend] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const startDate = startOfWeek(startOfMonth(currentMonth));
      const endDate = endOfWeek(endOfMonth(currentMonth));
      
      const data = await fetchEvents({
        startDate,
        endDate,
      });
      
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    let filtered = [...events];
    
    if (selectedBorough) {
      filtered = filtered.filter(e => e.event_borough === selectedBorough);
    }
    
    if (selectedEventType) {
      filtered = filtered.filter(e => e.event_type === selectedEventType);
    }
    
    if (isThisWeekend) {
      const now = new Date();
      const saturday = addDays(now, 6 - now.getDay());
      const sunday = addDays(saturday, 1);
      
      filtered = filtered.filter(e => {
        if (!e.start_date_time) return false;
        const eventDate = new Date(e.start_date_time);
        return isSameDay(eventDate, saturday) || isSameDay(eventDate, sunday);
      });
    }
    
    setFilteredEvents(filtered);
  }, [events, selectedBorough, selectedEventType, isThisWeekend]);

  const eventsByDate = useMemo(() => {
    return groupEventsByDate(filteredEvents);
  }, [filteredEvents]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return filteredEvents;
    
    const dateKey = selectedDate.toISOString().split("T")[0];
    return eventsByDate.get(dateKey) || [];
  }, [selectedDate, eventsByDate, filteredEvents]);

  const boroughs = useMemo(() => getUniqueBoroughs(events), [events]);
  const eventTypes = useMemo(() => getUniqueEventTypes(events), [events]);

  const handleClearFilters = () => {
    setSelectedBorough(null);
    setSelectedEventType(null);
    setIsThisWeekend(false);
  };

  const handleThisWeekendToggle = () => {
    setIsThisWeekend(!isThisWeekend);
    if (!isThisWeekend) {
      const now = new Date();
      const saturday = addDays(now, 6 - now.getDay());
      setSelectedDate(saturday);
      setCurrentMonth(now);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              NYC Free Events
            </h1>
          </div>
          
          <Alert variant="destructive" className="bg-red-950/50 border-red-900">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-300">Error loading events</AlertTitle>
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={loadEvents} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              NYC Free Events
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base ml-14">
            Discover free public events happening across New York City
          </p>
        </header>

        <div className="mb-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-[180px] bg-slate-800" />
                <Skeleton className="h-10 w-[200px] bg-slate-800" />
                <Skeleton className="h-10 w-[130px] bg-slate-800" />
              </div>
            </div>
          ) : (
            <Filters
              boroughs={boroughs}
              eventTypes={eventTypes}
              selectedBorough={selectedBorough}
              selectedEventType={selectedEventType}
              isThisWeekend={isThisWeekend}
              onBoroughChange={setSelectedBorough}
              onEventTypeChange={setSelectedEventType}
              onThisWeekendToggle={handleThisWeekendToggle}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              events={eventsByDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>
          
          <div>
            <EventList
              events={selectedDateEvents}
              selectedDate={selectedDate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
