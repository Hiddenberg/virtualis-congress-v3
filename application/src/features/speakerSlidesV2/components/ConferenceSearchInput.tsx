"use client";

import { Search } from "lucide-react";

interface ConferenceSearchInputProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
}

export function ConferenceSearchInput({
   value,
   onChange,
   placeholder = "Buscar por nombre de conferencia o ponente...",
}: ConferenceSearchInputProps) {
   return (
      <div className="relative">
         <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
         </div>
         <input
            type="text"
            className="block bg-white py-3 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
         />
      </div>
   );
}
