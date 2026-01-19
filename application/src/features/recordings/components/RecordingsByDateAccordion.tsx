"use client";

import {
   ChevronDown,
   ChevronRight,
   ChevronUp,
   Clock,
   Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface MinimalSpeakerData {
   id: string;
   displayName: string;
}

interface MinimalConferenceData {
   id: string;
   startTime: string;
   shortDescription?: string;
}

interface MinimalRecordingData {
   id: string;
   durationSeconds?: number | null;
}

export interface RecordingWithMetaItem {
   recording: MinimalRecordingData;
   recordingTitle: string;
   conference?: MinimalConferenceData;
   speakers: MinimalSpeakerData[];
}

function formatDuration(seconds?: number | null) {
   if (!seconds || seconds <= 0) return null;
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   if (hours > 0) return `${hours}h ${minutes}m`;
   return `${minutes}m`;
}

function getDateKey(isoString?: string) {
   if (!isoString) return "__no_date__";
   const d = new Date(isoString);
   // YYYY-MM-DD in local time
   const y = d.getFullYear();
   const m = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${y}-${m}-${day}`;
}

function formatDateLabel(isoString?: string) {
   if (!isoString) return "Sin fecha";
   const d = new Date(isoString);
   const formatter = new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });
   // Capitalize first letter
   const label = formatter.format(d);
   return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function RecordingsByDateAccordion({
   items,
}: {
   items: RecordingWithMetaItem[];
}) {
   const groups = useMemo(() => {
      const map = new Map<
         string,
         { label: string; items: RecordingWithMetaItem[] }
      >();
      for (const item of items) {
         const key = getDateKey(item.conference?.startTime);
         const label = formatDateLabel(item.conference?.startTime);
         if (!map.has(key)) {
            map.set(key, {
               label,
               items: [],
            });
         }
         map.get(key)!.items.push(item);
      }

      // sort items inside each group by recordingTitle
      for (const [, group] of map) {
         group.items.sort((a, b) =>
            a.recordingTitle.localeCompare(b.recordingTitle),
         );
      }

      // sort groups by date key, keeping "__no_date__" at the end
      const sorted = Array.from(map.entries()).sort((a, b) => {
         const [ka] = a;
         const [kb] = b;
         if (ka === "__no_date__") return 1;
         if (kb === "__no_date__") return -1;
         return ka.localeCompare(kb);
      });

      return sorted;
   }, [items]);

   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      if (groups.length > 0) {
         initial[groups[0][0]] = true;
      }
      return initial;
   });

   const toggle = (key: string) => {
      setOpenGroups((prev) => ({
         ...prev,
         [key]: !prev[key],
      }));
   };

   return (
      <div className="flex flex-col gap-4">
         {groups.map(([key, group]) => {
            const isOpen = !!openGroups[key];
            return (
               <section
                  key={key}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
               >
                  <button
                     type="button"
                     onClick={() => toggle(key)}
                     className="flex justify-between items-center hover:bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full text-left"
                     aria-expanded={isOpen}
                     aria-controls={`panel-${key}`}
                  >
                     <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800 text-base md:text-lg">
                           {group.label}
                        </span>
                        <span className="inline-flex items-center bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-full font-medium text-blue-700 text-xs">
                           {group.items.length}{" "}
                           {group.items.length === 1
                              ? "grabación"
                              : "grabaciones"}
                        </span>
                     </div>
                     {isOpen ? (
                        <ChevronUp
                           strokeWidth={2.5}
                           className="size-6 text-slate-600"
                        />
                     ) : (
                        <ChevronDown
                           strokeWidth={2.5}
                           className="size-6 text-slate-600"
                        />
                     )}
                  </button>

                  {isOpen && (
                     <div id={`panel-${key}`} className="bg-blue-100 px-4 py-4">
                        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
                           {group.items.map((item) => {
                              const {
                                 recording,
                                 recordingTitle,
                                 conference,
                                 speakers,
                              } = item;
                              const durationLabel = formatDuration(
                                 recording.durationSeconds,
                              );
                              return (
                                 <Link
                                    href={`/congress-recordings/${recording.id}`}
                                    key={recording.id}
                                    aria-label={`Ver grabación de ${recordingTitle}`}
                                    className="group relative flex flex-col bg-white shadow-sm hover:shadow-md p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                                 >
                                    <div className="mt-1">
                                       <h3 className="font-semibold text-slate-800 text-base md:text-lg line-clamp-2">
                                          {recordingTitle}
                                       </h3>
                                       {conference?.shortDescription && (
                                          <p className="mt-1 text-slate-600 md:text-[15px] text-sm">
                                             {conference.shortDescription}
                                          </p>
                                       )}

                                       {speakers.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-3">
                                             {speakers.map((speaker) => (
                                                <span
                                                   key={speaker.id}
                                                   className="inline-flex items-center bg-blue-50 px-2.5 py-1 border border-blue-100 rounded-full font-medium text-blue-700 text-xs"
                                                >
                                                   {speaker.displayName}
                                                </span>
                                             ))}
                                          </div>
                                       )}

                                       <div className="flex justify-between items-center mt-4 text-slate-600 text-xs md:text-sm">
                                          <div className="flex items-center gap-3">
                                             <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4" />
                                                <span>
                                                   {speakers.length}{" "}
                                                   {speakers.length === 1
                                                      ? "ponente"
                                                      : "ponentes"}
                                                </span>
                                             </div>
                                             {durationLabel && (
                                                <div className="flex items-center gap-1.5">
                                                   <Clock className="w-4 h-4" />
                                                   <span>{durationLabel}</span>
                                                </div>
                                             )}
                                          </div>
                                          <span className="inline-flex items-center gap-1 font-medium text-blue-700">
                                             Ver{" "}
                                             <ChevronRight className="w-4 h-4" />
                                          </span>
                                       </div>
                                    </div>
                                 </Link>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </section>
            );
         })}
      </div>
   );
}
