"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export default function GenericExpandableSection({
   title,
   defaultExpanded = false,
   children,
}: {
   title: string;
   defaultExpanded?: boolean;
   className?: string;
   children: React.ReactNode;
}) {
   const [isExpanded, setIsExpanded] = useState(defaultExpanded);

   const handleToggleExpanded = () => {
      setIsExpanded(!isExpanded);
   };
   return (
      <div className="space-y-4">
         <button
            className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl w-full h-full transition-all duration-200"
            onClick={handleToggleExpanded}
         >
            <p>{title}</p>
            <ChevronDownIcon className={`size-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
         </button>
         {isExpanded && children}
      </div>
   );
}
