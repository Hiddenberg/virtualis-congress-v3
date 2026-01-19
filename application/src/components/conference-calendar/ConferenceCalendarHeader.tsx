"use client";

import { format } from "@formkit/tempo";
import Link from "next/link";

export function ConferenceCalendarHeader({
   congressDates,
   currentDate,
}: {
   congressDates: Date[];
   currentDate: string;
}) {
   return (
      <div className="mx-auto mb-4 w-full">
         <div className="flex justify-between items-center">
            {/* Date Selector */}
            <div className="flex gap-2">
               {congressDates.map((date) => (
                  <Link
                     href={`./${format(date, "DD-MM-YYYY")}`}
                     key={date.toISOString()}
                     className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        currentDate === format(date, "DD-MM-YYYY")
                           ? "bg-gray-900 text-white"
                           : "text-gray-600 hover:bg-gray-100"
                     }`}
                  >
                     {format(date, "dddd DD")}
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}
