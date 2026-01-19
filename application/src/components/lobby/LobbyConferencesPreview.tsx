"use client";

import { format } from "@formkit/tempo";
import { Calendar, Clock, Mic2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";

interface LobbyConferencesPreviewProps {
   conferences: ConferenceWithSpeakers[];
}

export default function LobbyConferencesPreview({
   conferences,
}: LobbyConferencesPreviewProps) {
   const [activeIdx, setActiveIdx] = useState(0);

   const days = useMemo(() => {
      const dateKeyToConferences = new Map<string, ConferenceWithSpeakers[]>();
      for (const conferenceWithSpeakers of conferences) {
         if (
            !conferenceWithSpeakers.conference.startTime ||
            !conferenceWithSpeakers.conference.endTime
         )
            continue;
         const start = new Date(conferenceWithSpeakers.conference.startTime);
         const key = `${start.getFullYear()}-${String(
            start.getMonth() + 1,
         ).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
         const list = dateKeyToConferences.get(key) ?? [];
         list.push(conferenceWithSpeakers);
         dateKeyToConferences.set(key, list);
      }

      const grouped = Array.from(dateKeyToConferences.entries())
         .sort(([a], [b]) => a.localeCompare(b))
         .map(([key, list]) => {
            const [y, m, d] = key.split("-").map(Number);
            const date = new Date(y, m - 1, d);
            const conferencesSorted = list.sort(
               (a, b) =>
                  new Date(a.conference.startTime).getTime() -
                  new Date(b.conference.startTime).getTime(),
            );
            return {
               dateISO: date.toISOString(),
               conferences: conferencesSorted,
            };
         });

      return grouped;
   }, [conferences]);

   const formattedDays = useMemo(
      () =>
         days.map((d) => ({
            ...d,
            label: format({
               date: d.dateISO,
               format: "DD MMMM",
               locale: "es-MX",
               tz: "America/Mexico_City",
            }),
         })),
      [days],
   );

   const current = formattedDays[activeIdx];

   return (
      <section aria-label="Próximas conferencias" className="w-full max-w-6xl">
         <div className="bg-white shadow-sm border border-blue-100 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 md:px-6 py-4">
               <Calendar className="w-4 h-4 text-blue-700" />
               <h3 className="font-semibold text-slate-800 text-base md:text-lg">
                  Próximas conferencias
               </h3>
            </div>

            {/* Day tabs */}
            {formattedDays.length > 0 && (
               <div className="flex gap-2 px-4 md:px-6 pt-4 overflow-x-auto">
                  {formattedDays.map((d, idx) => (
                     <button
                        key={d.dateISO}
                        onClick={() => setActiveIdx(idx)}
                        className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors whitespace-nowrap ${idx === activeIdx ? "bg-blue-100 text-blue-800 border border-blue-200" : "text-blue-700 hover:bg-blue-50 border border-transparent"}`}
                     >
                        {d.label}
                     </button>
                  ))}
               </div>
            )}

            {/* List */}
            <div className="px-4 md:px-6 py-4">
               {current ? (
                  <div className="space-y-3 pr-1 overflow-y-auto">
                     {current.conferences.map((conf) => (
                        <div
                           key={conf.conference.id}
                           className="bg-blue-50/40 hover:bg-blue-50 p-3 md:p-4 border border-blue-100 hover:border-blue-200 rounded-xl transition-colors"
                        >
                           <div className="flex md:flex-row flex-col md:items-center gap-3 md:gap-4">
                              <div className="inline-flex items-center gap-1.5 bg-blue-100 px-2.5 py-1 rounded-md font-semibold text-blue-800 text-xs">
                                 <Clock className="w-3.5 h-3.5" />
                                 {format({
                                    date: conf.conference.startTime,
                                    format: "hh:mm A",
                                    locale: "es-MX",
                                    tz: "America/Mexico_City",
                                 })}
                                 <span className="opacity-60">—</span>
                                 {format({
                                    date: conf.conference.endTime,
                                    format: "hh:mm A",
                                    locale: "es-MX",
                                    tz: "America/Mexico_City",
                                 })}
                              </div>
                              <div className="min-w-0">
                                 <div className="font-semibold text-slate-800 text-sm md:text-base truncate leading-snug">
                                    {conf.conference.title}
                                 </div>
                                 {conf.conference.shortDescription && (
                                    <p className="mt-0.5 text-slate-600 text-xs md:text-sm line-clamp-2">
                                       {conf.conference.shortDescription}
                                    </p>
                                 )}
                                 {conf.speakers.length > 0 && (
                                    <div className="flex items-center gap-1 mt-0.5 text-slate-600 text-xs md:text-sm line-clamp-2">
                                       <Mic2 className="size-4" />
                                       {conf.speakers
                                          .map(
                                             (speaker) =>
                                                `${speaker.academicTitle} ${speaker.displayName}`,
                                          )
                                          .join(", ")}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                     {current.conferences.length === 0 && (
                        <div className="bg-blue-50/40 p-4 border border-blue-100 rounded-xl text-blue-700 text-sm text-center">
                           Sin conferencias para este día.
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="bg-blue-50/40 p-6 border border-blue-100 rounded-xl text-blue-700 text-sm text-center">
                     Pronto publicaremos el programa.
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
