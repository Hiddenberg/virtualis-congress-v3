"use client";

import { format } from "@formkit/tempo";
import { generateTimeSlots } from "@/utils/timeUtils";

export default function TimeSlots({
   timeSlots,
}: {
   timeSlots: ReturnType<typeof generateTimeSlots>;
}) {
   return (
      <div className="flex flex-col gap-4">
         {timeSlots.map((timeSlot) => (
            <div
               key={timeSlot.start.toISOString()}
               className="flex flex-col justify-center items-center p-4 border rounded-3xl w-max h-52 text-sm text-center"
            >
               <p>{format(timeSlot.start, "HH:mm")}</p>
               <p>-</p>
               <p>{format(timeSlot.end, "HH:mm")}</p>
            </div>
         ))}
      </div>
   );
}
