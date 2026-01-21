"use client";

import { format } from "@formkit/tempo";
import { Search } from "lucide-react";
import { Children, useMemo, useState } from "react";

interface AdminConferencesBrowserProps {
   conferences: CongressConferenceRecord[];
   children: React.ReactNode;
}

export default function AdminConferencesBrowser({ conferences, children }: AdminConferencesBrowserProps) {
   const [selectedDateKey, setSelectedDateKey] = useState<string>("all");
   const [query, setQuery] = useState<string>("");

   const items = useMemo(() => {
      return conferences.map((conference) => ({
         id: conference.id,
         title: conference.title,
         dateKey: format({
            date: conference.startTime,
            format: "YYYY-MM-DD",
            locale: "es-MX",
         }),
      }));
   }, [conferences]);

   const uniqueDateKeys = useMemo(() => {
      const keys = Array.from(new Set(items.map((i) => i.dateKey)));
      return keys.sort((a, b) => a.localeCompare(b));
   }, [items]);

   const childrenArray = useMemo(() => Children.toArray(children), [children]);

   const visibilityByIndex = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      return items.map((item) => {
         const matchesDate = selectedDateKey === "all" || item.dateKey === selectedDateKey;
         const matchesQuery = normalizedQuery === "" || item.title.toLowerCase().includes(normalizedQuery);
         return matchesDate && matchesQuery;
      });
   }, [items, selectedDateKey, query]);

   const visibleCount = useMemo(() => visibilityByIndex.filter(Boolean).length, [visibilityByIndex]);

   return (
      <div className="space-y-6">
         <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
            <div role="tablist" aria-label="Filtrar por fecha" className="flex flex-wrap items-center gap-2">
               <TabButton isActive={selectedDateKey === "all"} onClick={() => setSelectedDateKey("all")} label="Todas" />
               {uniqueDateKeys.map((key) => (
                  <TabButton
                     key={key}
                     isActive={selectedDateKey === key}
                     onClick={() => setSelectedDateKey(key)}
                     label={formatDateHuman(key)}
                  />
               ))}
            </div>

            <div className="relative w-full md:w-80">
               <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none" />
               <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título..."
                  className="bg-white py-2 pr-3 pl-9 rounded-lg focus:outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-400 w-full text-sm"
                  aria-label="Buscar conferencia por título"
               />
            </div>
         </div>

         {visibleCount === 0 ? (
            <div className="bg-white shadow-sm p-10 border border-gray-300 border-dashed rounded-xl text-center">
               <p className="text-gray-600">No hay conferencias que coincidan con los filtros</p>
            </div>
         ) : (
            <div className="gap-6 grid grid-cols-1">
               {childrenArray.map((child, index) => (
                  <div key={index} className={visibilityByIndex[index] ? "contents" : "hidden"}>
                     {child}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

function TabButton({ isActive, onClick, label }: { isActive: boolean; onClick: () => void; label: string }) {
   return (
      <button
         type="button"
         role="tab"
         aria-selected={isActive}
         onClick={onClick}
         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ring-1 ${isActive ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-gray-700 hover:bg-blue-50 ring-gray-300"}`}
      >
         {label}
      </button>
   );
}

function formatDateHuman(dateKey: string): string {
   try {
      // Intl.DateTimeFormat for client-side formatting (no extra deps on client)
      const [year, month, day] = dateKey.split("-").map((n) => Number(n));
      const date = new Date(year, month - 1, day);
      const weekday = new Intl.DateTimeFormat("es-MX", {
         weekday: "long",
      }).format(date);
      const dayNum = new Intl.DateTimeFormat("es-MX", {
         day: "2-digit",
      }).format(date);
      const monthName = new Intl.DateTimeFormat("es-MX", {
         month: "long",
      }).format(date);
      const yearNum = new Intl.DateTimeFormat("es-MX", {
         year: "numeric",
      }).format(date);
      return `${capitalize(weekday)} ${dayNum} ${monthName} ${yearNum}`;
   } catch {
      return dateKey;
   }
}

function capitalize(text: string): string {
   return text.charAt(0).toUpperCase() + text.slice(1);
}
