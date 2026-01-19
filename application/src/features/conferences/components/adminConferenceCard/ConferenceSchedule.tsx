"use client";

import { format } from "@formkit/tempo";
import { CalendarIcon, Clock3Icon } from "lucide-react";

// Using a client component to avoid showing the dates in the server time
export default function ConferenceSchedule({
   startTime,
   endTime,
}: {
   startTime: string;
   endTime: string;
}) {
   const conferenceDateText = format({
      date: startTime,
      format: "dddd DD MMMM YYYY",
      locale: "es-MX",
   });
   const startTimeText = format({
      date: startTime,
      format: "HH:mm A",
      locale: "es-MX",
   });
   const endTimeText = format({
      date: endTime,
      format: "HH:mm A",
      locale: "es-MX",
   });

   return (
      <div className="space-y-2 text-sm">
         <div className="flex items-center gap-2 text-gray-700">
            <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md ring-1 ring-gray-200">
               <CalendarIcon className="w-4 h-4 text-gray-500" />
               <span className="font-medium text-gray-900">
                  {conferenceDateText}
               </span>
            </span>
         </div>
         <div className="flex items-center gap-2 text-gray-700">
            <span className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md ring-1 ring-blue-200">
               <Clock3Icon className="w-4 h-4 text-blue-600" />
               <span className="tabular-nums text-blue-700">
                  {startTimeText}
               </span>
               <span className="mx-1 text-blue-700">–</span>
               <span className="tabular-nums text-blue-700">{endTimeText}</span>
            </span>
         </div>
      </div>
   );
}
