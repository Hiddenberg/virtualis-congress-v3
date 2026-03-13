"use client";

import { Children, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ConferenceRoomRecord } from "../types/conferenceRoomsTypes";

interface ConferenceRoomsBrowserProps {
   conferenceRooms: ConferenceRoomRecord[];
   children: React.ReactNode;
}

export default function ConferenceRoomsBrowser({ conferenceRooms, children }: ConferenceRoomsBrowserProps) {
   const [query, setQuery] = useState("");

   const childrenArray = useMemo(() => Children.toArray(children), [children]);

   const visibilityByIndex = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      return conferenceRooms.map((conferenceRoom) => {
         if (normalizedQuery === "") {
            return true;
         }

         return (
            conferenceRoom.name.toLowerCase().includes(normalizedQuery) ||
            conferenceRoom.description?.toLowerCase().includes(normalizedQuery) === true
         );
      });
   }, [conferenceRooms, query]);

   const visibleCount = useMemo(() => visibilityByIndex.filter(Boolean).length, [visibilityByIndex]);

   return (
      <div className="space-y-6">
         <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
               <p className="font-semibold text-gray-900 text-base">Explora las salas creadas</p>
               <p className="text-gray-600 text-sm">Busca por nombre o descripción para encontrar rápidamente la sala que necesitas editar.</p>
            </div>

            <div className="flex sm:flex-row flex-col sm:items-center gap-3 lg:min-w-[420px]">
               <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                     type="text"
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     placeholder="Buscar salas..."
                     className="w-full rounded-xl bg-white py-3 pl-9 pr-4 text-sm text-gray-900 ring-1 ring-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                     aria-label="Buscar sala por nombre"
                  />
               </div>
               <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-blue-700 text-sm">
                  <span className="font-semibold">{visibleCount}</span> sala{visibleCount === 1 ? "" : "s"}
               </div>
            </div>
         </div>

         {visibleCount === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
               <p className="font-medium text-gray-900">No hay salas que coincidan con tu búsqueda</p>
               <p className="mt-2 text-gray-600 text-sm">Prueba con otro nombre o limpia el filtro para ver todas las opciones.</p>
            </div>
         ) : (
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
               {childrenArray.map((child, index) => (
                  <div key={conferenceRooms[index]?.id ?? index} className={visibilityByIndex[index] ? "contents" : "hidden"}>
                     {child}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
