"use client";

import { format } from "@formkit/tempo";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DateTimePickerProps {
   id: string;
   label: string;
   value: string;
   onChange: (value: string) => void;
   required?: boolean;
}

export function DateTimePicker({ id, label, value, onChange, required = false }: DateTimePickerProps) {
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
   const datePickerRef = useRef<HTMLDivElement>(null);

   // Parse the input value into date and time parts
   const date = value ? new Date(value) : new Date();
   const formattedDate = !isNaN(date.getTime()) ? format(date, "YYYY-MM-DD") : format(new Date(), "YYYY-MM-DD");
   const formattedTime = !isNaN(date.getTime()) ? format(date, "HH:mm") : "";

   // Close the date picker when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
            setIsDatePickerOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Update the value when date or time changes
   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      const time = formattedTime || "00:00";
      const newValue = `${newDate}T${time}`;
      onChange(newValue);
   };

   const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      const newValue = `${formattedDate}T${newTime}`;
      onChange(newValue);
   };

   // Handle date selection from calendar
   const handleDateSelect = (dateString: string) => {
      const time = formattedTime || "00:00";
      const newValue = `${dateString}T${time}`;
      onChange(newValue);
      setIsDatePickerOpen(false);
   };

   // Generate calendar dates
   const generateCalendar = () => {
      const selectedDate = new Date(formattedDate);
      const currentMonth = selectedDate.getMonth();
      const currentYear = selectedDate.getFullYear();

      // Get first day of month
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const dayOfWeek = firstDayOfMonth.getDay();

      // Get days in month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Days from previous month to show
      const prevMonthDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start

      // Previous month
      const prevMonth = new Date(currentYear, currentMonth, 0);
      const prevMonthLastDay = prevMonth.getDate();

      const days = [];

      // Previous month days
      for (let i = prevMonthDays - 1; i >= 0; i--) {
         const day = prevMonthLastDay - i;
         const dateObj = new Date(currentYear, currentMonth - 1, day);
         days.push({
            date: format(dateObj, "YYYY-MM-DD"),
            day,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
         });
      }

      // Current month days
      const today = new Date();
      for (let i = 1; i <= daysInMonth; i++) {
         const dateObj = new Date(currentYear, currentMonth, i);
         days.push({
            date: format(dateObj, "YYYY-MM-DD"),
            day: i,
            isCurrentMonth: true,
            isToday: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
            isSelected:
               i === selectedDate.getDate() &&
               currentMonth === selectedDate.getMonth() &&
               currentYear === selectedDate.getFullYear(),
         });
      }

      // Fill in remaining days
      const totalDaysToShow = 42; // 6 weeks
      const nextMonthDays = totalDaysToShow - days.length;
      for (let i = 1; i <= nextMonthDays; i++) {
         const dateObj = new Date(currentYear, currentMonth + 1, i);
         days.push({
            date: format(dateObj, "YYYY-MM-DD"),
            day: i,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
         });
      }

      return days;
   };

   const calendar = generateCalendar();

   // Navigate to previous/next month
   const navigateMonth = (direction: "prev" | "next") => {
      const currentDate = new Date(formattedDate);
      let newDate: Date;

      if (direction === "prev") {
         newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      } else {
         newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }

      handleDateSelect(format(newDate, "YYYY-MM-DD"));
   };

   // Format for display
   const displayDate = !isNaN(date.getTime()) ? format(date, "DD MMM YYYY") : "Seleccionar fecha";

   return (
      <fieldset className="flex flex-col gap-1">
         <label htmlFor={id} className="font-medium text-sm">
            {label}
         </label>
         <div className="flex flex-col gap-2">
            <div className="relative" ref={datePickerRef}>
               {/* Date input - visible */}
               <div
                  className="relative flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
               >
                  <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                  <span className={!displayDate || displayDate === "Seleccionar fecha" ? "text-gray-400" : "text-gray-900"}>
                     {displayDate}
                  </span>
               </div>

               {/* Hidden date input for form submission */}
               <input type="date" className="sr-only" value={formattedDate} onChange={handleDateChange} required={required} />

               {/* Date picker dropdown */}
               {isDatePickerOpen && (
                  <div className="z-10 absolute bg-white shadow-lg mt-1 p-2 border border-gray-200 rounded-md w-[300px]">
                     {/* Calendar header */}
                     <div className="flex justify-between items-center mb-2">
                        <button
                           type="button"
                           onClick={() => navigateMonth("prev")}
                           className="hover:bg-gray-100 p-1 rounded-full"
                        >
                           &lt;
                        </button>
                        <div className="font-medium">{format(new Date(formattedDate), "MMMM YYYY")}</div>
                        <button
                           type="button"
                           onClick={() => navigateMonth("next")}
                           className="hover:bg-gray-100 p-1 rounded-full"
                        >
                           &gt;
                        </button>
                     </div>

                     {/* Weekdays header */}
                     <div className="grid grid-cols-7 mb-1">
                        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
                           <div key={day} className="py-1 font-medium text-gray-500 text-xs text-center">
                              {day}
                           </div>
                        ))}
                     </div>

                     {/* Calendar days */}
                     <div className="grid grid-cols-7">
                        {calendar.map((day, index) => (
                           <button
                              key={index}
                              type="button"
                              onClick={() => handleDateSelect(day.date)}
                              className={`
                                 p-1 text-sm h-8 w-full flex items-center justify-center
                                 ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                                 ${day.isToday ? "border border-blue-500" : ""}
                                 ${day.isSelected && day.isCurrentMonth ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}
                                 rounded-full
                              `}
                           >
                              {day.day}
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* Time input */}
            <div className="relative">
               <input
                  id={`${id}-time`}
                  type="time"
                  value={formattedTime}
                  onChange={handleTimeChange}
                  required={required}
                  className="px-3 py-2 pr-10 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
               />
               <Clock className="top-1/2 right-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
            </div>
         </div>
      </fieldset>
   );
}
