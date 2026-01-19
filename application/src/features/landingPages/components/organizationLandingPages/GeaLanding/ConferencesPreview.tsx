"use client";

import { format } from "@formkit/tempo";
import { Calendar, Clock, Mic2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";

export default function ConferencesPreview({
   conferences,
}: {
   conferences: ConferenceWithSpeakers[];
}) {
   const [activeIdx, setActiveIdx] = useState(0);

   // Build grouped days from the conferences list
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
      <div className="relative flex flex-col bg-black/20 shadow-2xl backdrop-blur-lg p-4 md:p-6 border border-white/20 rounded-2xl w-full max-w-md md:max-h-[90dvh] text-white">
         {/* Tabs */}
         <div className="gap-2 grid grid-cols-3 mb-4">
            {formattedDays.map((d, idx) => (
               <button
                  key={d.dateISO}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 py-2 capitalize rounded-lg border border-white/20 text-sm font-semibold whitespace-nowrap bg-white/20 transition-all duration-300 ${idx === activeIdx ? "bg-white/50 text-white shadow" : "text-cyan-100 hover:bg-white/10"}`}
               >
                  {/* <span className="inline-flex justify-center items-center bg-white/20 mr-2 rounded-full w-7 h-7 font-bold text-xs">{d.dayNum}</span> */}
                  {/* {d.label} */}
                  {format({
                     date: d.dateISO,
                     format: "DD MMMM",
                     locale: "es-MX",
                  })}
               </button>
            ))}
         </div>

         {/* Current day */}
         {current ? (
            <div className="flex flex-col overflow-hidden">
               <div className="flex items-center gap-3 mb-3">
                  <div className="flex justify-center items-center bg-white/20 rounded-full w-10 h-10">
                     <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="font-bold text-white text-lg capitalize">
                        {format({
                           date: current.dateISO,
                           format: "dddd DD MMMM",
                           locale: "es-MX",
                        })}
                     </div>
                  </div>
               </div>

               <div className="space-y-3 pr-1 overflow-y-auto">
                  {current.conferences.map((conf) => (
                     <div
                        key={conf.conference.id}
                        className="bg-white/10 hover:bg-white/15 p-3 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300"
                     >
                        <div className="flex flex-col items-start gap-3">
                           <div className="flex justify-center items-center bg-blue-300/20 py-1 rounded-md font-semibold text-cyan-100 text-xs">
                              <Clock className="mr-1 w-3.5 h-3.5" />{" "}
                              {format({
                                 date: conf.conference.startTime,
                                 format: "hh:mm A",
                                 locale: "es-MX",
                              })}{" "}
                              -{" "}
                              {format({
                                 date: conf.conference.endTime,
                                 format: "hh:mm A",
                                 locale: "es-MX",
                              })}
                           </div>
                           <div>
                              <div className="font-semibold text-white text-sm leading-snug">
                                 {conf.conference.title}
                              </div>
                              {conf.conference.shortDescription && (
                                 <p className="mt-1 text-cyan-100/80 text-xs line-clamp-3 leading-relaxed">
                                    {conf.conference.shortDescription}
                                 </p>
                              )}
                           </div>
                           {conf.speakers.length > 0 && (
                              <div className="flex items-center gap-1 mt-0.5 text-white text-xs md:text-sm line-clamp-2">
                                 <Mic2Icon className="size-4" />
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
                  ))}
                  {current.conferences.length === 0 && (
                     <div className="bg-white/10 p-4 border border-white/20 rounded-xl text-cyan-100 text-sm text-center">
                        Sin conferencias para este día.
                     </div>
                  )}
               </div>

               {/* <div className="mt-4 text-right">
                  <a href="#program-schedule" className="inline-flex items-center gap-2 bg-white hover:bg-cyan-50 px-4 py-2 rounded-full font-bold text-blue-900 text-sm transition-all duration-300">
                     <Calendar className="w-4 h-4" /> Ver programa completo
                  </a>
               </div> */}
            </div>
         ) : (
            <div className="text-cyan-100 text-sm">
               Pronto publicaremos el programa.
            </div>
         )}
      </div>
   );
}
