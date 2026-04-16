import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval, 
  startOfDay, 
  endOfDay,
  subDays,
  startOfToday,
  startOfYesterday
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026
  const [tempRange, setTempRange] = useState<DateRange>({
    start: value.start ? new Date(value.start) : null,
    end: value.end ? new Date(value.end) : null
  });

  useEffect(() => {
    setTempRange({
      start: value.start ? new Date(value.start) : null,
      end: value.end ? new Date(value.end) : null
    });
  }, [value]);
  const [activePreset, setActivePreset] = useState('오늘');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextMonth = addMonths(currentMonth, 1);

  const presets = [
    { label: '오늘', getValue: () => ({ start: startOfToday(), end: startOfToday() }) },
    { label: '어제', getValue: () => ({ start: startOfYesterday(), end: startOfYesterday() }) },
    { label: '지난 7일', getValue: () => ({ start: subDays(startOfToday(), 6), end: startOfToday() }) },
    { label: '지난 30일', getValue: () => ({ start: subDays(startOfToday(), 29), end: startOfToday() }) },
    { label: '맞춤 범위', getValue: () => tempRange },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setActivePreset(preset.label);
    if (preset.label !== '맞춤 범위') {
      const range = preset.getValue();
      setTempRange(range);
    }
  };

  const handleDateClick = (date: Date) => {
    setActivePreset('맞춤 범위');
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: date, end: null });
    } else {
      if (date < tempRange.start) {
        setTempRange({ start: date, end: tempRange.start });
      } else {
        setTempRange({ ...tempRange, end: date });
      }
    }
  };

  const isSelected = (date: Date) => {
    if (tempRange.start && isSameDay(date, tempRange.start)) return true;
    if (tempRange.end && isSameDay(date, tempRange.end)) return true;
    return false;
  };

  const isInRange = (date: Date) => {
    if (tempRange.start && tempRange.end) {
      return isWithinInterval(date, { start: tempRange.start, end: tempRange.end });
    }
    return false;
  };

  const renderCalendar = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    // Padding for start of week (Monday start)
    const startDay = (start.getDay() + 6) % 7;
    const padding = Array.from({ length: startDay });

    return (
      <div className="w-64">
        <div className="text-center font-bold text-xs mb-4">
          {format(month, 'yyyy년 M월', { locale: ko })}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {['월', '화', '수', '목', '금', '토', '일'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
          ))}
          {padding.map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const isToday = isSameDay(day, startOfToday());

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "h-8 w-8 text-[11px] font-medium rounded-lg transition-all relative flex items-center justify-center",
                  selected ? "bg-blue-600 text-white z-10" : 
                  inRange ? "bg-blue-50 text-blue-600 rounded-none" : 
                  "hover:bg-slate-100 text-slate-700",
                  !isSameMonth(day, month) && "text-slate-300 pointer-events-none"
                )}
              >
                {format(day, 'd')}
                {isToday && !selected && (
                  <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleApply = () => {
    if (tempRange.start && tempRange.end) {
      onChange({
        start: format(tempRange.start, 'yyyy-MM-dd'),
        end: format(tempRange.end, 'yyyy-MM-dd')
      });
      setIsOpen(false);
    }
  };

  const displayValue = value.start && value.end 
    ? `${value.start} ~ ${value.end}`
    : '날짜 선택';

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 text-xs font-bold text-slate-700 hover:border-blue-300 transition-all min-w-[200px]",
          isOpen && "ring-2 ring-blue-500/20 border-blue-500"
        )}
      >
        <CalendarIcon size={14} className="text-slate-400" />
        <span>{displayValue}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl z-[100] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
          <div className="flex">
            {/* Sidebar Presets */}
            <div className="w-32 border-r border-slate-100 bg-slate-50/50 p-2 flex flex-col gap-1">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => handlePresetClick(p)}
                  className={cn(
                    "text-left px-3 py-2 text-[11px] font-bold rounded-md transition-all",
                    activePreset === p.label 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendars */}
            <div className="p-6 flex gap-8">
              <div className="relative">
                <button 
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="absolute -left-2 top-0 p-1 hover:bg-slate-100 rounded-md text-slate-400"
                >
                  <ChevronLeft size={16} />
                </button>
                {renderCalendar(currentMonth)}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="absolute -right-2 top-0 p-1 hover:bg-slate-100 rounded-md text-slate-400"
                >
                  <ChevronRight size={16} />
                </button>
                {renderCalendar(nextMonth)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4 bg-slate-50/30 flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-500">
              {tempRange.start && format(tempRange.start, 'yyyy-MM-dd')}
              {tempRange.end && ` - ${format(tempRange.end, 'yyyy-MM-dd')}`}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-100 rounded-md transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleApply}
                disabled={!tempRange.start || !tempRange.end}
                className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
