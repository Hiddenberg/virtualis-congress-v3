"use client";

import { format } from "@formkit/tempo";

// import { Plus } from "lucide-react"
// import { useState } from "react"

export function EmptyScheduleItem({
   timeSlot,
}: {
   timeSlot: { start: Date; end: Date };
}) {
   // const [isPopUpOpen, setIsPopUpOpen] = useState(false)

   return (
      <div className="flex flex-col justify-center items-center gap-2 bg-gray-100 rounded-3xl h-52">
         <p>
            {format(timeSlot.start, "HH:mm")} - {format(timeSlot.end, "HH:mm")}
         </p>
         <p>Sin conferencias programadas</p>
      </div>
   );
}
