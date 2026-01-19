"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DaySwitcherProps {
   days: string[];
}

export default function DaySwitcher({ days }: DaySwitcherProps) {
   const [index, setIndex] = useState(0);

   const goPrev = () => setIndex((i) => (i - 1 + days.length) % days.length);
   const goNext = () => setIndex((i) => (i + 1) % days.length);

   return (
      <div className="flex flex-wrap justify-between items-center gap-3 mt-6 px-6 md:px-10">
         <div className="inline-flex items-center gap-2 text-gray-700">
            <Calendar size={18} />
            <span className="font-medium text-sm">{days[index]}</span>
         </div>
         <div className="flex items-center gap-2">
            <button
               onClick={goPrev}
               className="inline-flex justify-center items-center bg-white hover:bg-gray-50 shadow-sm border border-gray-200 rounded-full w-9 h-9 text-gray-700"
            >
               <ChevronLeft size={18} />
            </button>
            <button
               onClick={goNext}
               className="inline-flex justify-center items-center bg-white hover:bg-gray-50 shadow-sm border border-gray-200 rounded-full w-9 h-9 text-gray-700"
            >
               <ChevronRight size={18} />
            </button>
         </div>
      </div>
   );
}
