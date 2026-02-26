"use client";

import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NYCEvents } from "@/lib/types";

interface CalendarProps {
  events: Map<string, NYCEvents[]>;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({
  events,
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
}: CalendarProps) {
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today);
    onSelectDate(today);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-lg md:text-xl font-semibold text-slate-100">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
        >
          Today
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-medium text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateKey = day.toISOString().split("T")[0];
          const dayEvents = events.get(dateKey) || [];
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={`
                relative aspect-square flex flex-col items-center justify-center
                rounded-lg transition-all duration-200 text-sm
                ${isCurrentMonth 
                  ? "text-slate-200 hover:bg-slate-800" 
                  : "text-slate-600 hover:bg-slate-800/50"
                }
                ${isSelected 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : ""
                }
                ${isTodayDate && !isSelected 
                  ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900" 
                  : ""
                }
              `}
            >
              <span className="font-medium">{format(day, "d")}</span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected 
                          ? "bg-white/70" 
                          : "bg-indigo-500"
                      }`}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className={`text-[8px] ${isSelected ? "text-white/70" : "text-slate-500"}`}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
