"use client";

import { Filter, MapPin, Tags, CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FiltersProps {
  boroughs: string[];
  eventTypes: string[];
  selectedBorough: string | null;
  selectedEventType: string | null;
  isThisWeekend: boolean;
  onBoroughChange: (borough: string | null) => void;
  onEventTypeChange: (type: string | null) => void;
  onThisWeekendToggle: () => void;
  onClearFilters: () => void;
}

export function Filters({
  boroughs,
  eventTypes,
  selectedBorough,
  selectedEventType,
  isThisWeekend,
  onBoroughChange,
  onEventTypeChange,
  onThisWeekendToggle,
  onClearFilters,
}: FiltersProps) {
  const hasActiveFilters = selectedBorough || selectedEventType || isThisWeekend;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedBorough || "all"}
            onValueChange={(value) => onBoroughChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700 text-slate-200">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Boroughs" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-slate-100">
                All Boroughs
              </SelectItem>
              {boroughs.map((borough) => (
                <SelectItem 
                  key={borough} 
                  value={borough}
                  className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
                >
                  {borough}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedEventType || "all"}
            onValueChange={(value) => onEventTypeChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-800/50 border-slate-700 text-slate-200">
              <Tags className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Event Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
              <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-slate-100">
                All Event Types
              </SelectItem>
              {eventTypes.map((type) => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={isThisWeekend ? "default" : "outline"}
            size="sm"
            onClick={onThisWeekendToggle}
            className={`
              w-full sm:w-auto gap-2
              ${isThisWeekend 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                : "border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
              }
            `}
          >
            <CalendarDays className="h-4 w-4" />
            This Weekend
          </Button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedBorough && (
            <Badge 
              variant="secondary" 
              className="bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700"
              onClick={() => onBoroughChange(null)}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {selectedBorough}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {selectedEventType && (
            <Badge 
              variant="secondary"
              className="bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700"
              onClick={() => onEventTypeChange(null)}
            >
              <Tags className="h-3 w-3 mr-1" />
              {selectedEventType}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {isThisWeekend && (
            <Badge 
              variant="secondary"
              className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 cursor-pointer hover:bg-indigo-600/40"
              onClick={onThisWeekendToggle}
            >
              <CalendarDays className="h-3 w-3 mr-1" />
              This Weekend
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
