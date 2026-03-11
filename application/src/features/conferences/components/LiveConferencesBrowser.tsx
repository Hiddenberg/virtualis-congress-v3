"use client";

import { format } from "@formkit/tempo";
import { ExternalLinkIcon, LinkIcon, PlayIcon, RadioIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/global/Buttons";
import type { LiveConferencesByDay, LiveConferenceWithLinks } from "../services/conferenceServices";

interface LiveConferencesBrowserProps {
   conferencesByDay: LiveConferencesByDay[];
}

function TransmissionLinkRow({
   label,
   link,
   variant,
   icon: Icon,
}: {
   label: string;
   link: string;
   variant: "host" | "invitee";
   icon: React.ElementType;
}) {
   const IconComponent = Icon;
   return (
      <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-3 bg-gray-50 p-3 border border-gray-200 rounded-lg">
         <div className="flex items-center gap-2 min-w-0">
            <IconComponent className={`w-4 h-4 shrink-0 ${variant === "host" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="font-medium text-gray-700 text-sm shrink-0">{label}</span>
         </div>
         <div className="flex flex-1 items-center gap-2 min-w-0">
            <span className="flex-1 min-w-0 text-gray-800 text-sm truncate" title={link}>
               {link}
            </span>
            <div className="flex items-center gap-2 shrink-0">
               <CopyButton text={link} />
               <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-medium ${
                     variant === "host" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-800"
                  }`}
               >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Abrir
               </Link>
            </div>
         </div>
      </div>
   );
}

function LiveConferenceCard({ conference }: { conference: LiveConferenceWithLinks }) {
   return (
      <div className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
         <div className="mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">{conference.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
               <span>
                  {format({
                     date: conference.startTime,
                     format: "hh:mm A",
                     tz: "America/Mexico_City",
                     locale: "es-MX",
                  })}
               </span>
               <span>-</span>
               <span>
                  {format({
                     date: conference.endTime,
                     format: "hh:mm A",
                     tz: "America/Mexico_City",
                     locale: "es-MX",
                  })}
               </span>
            </div>
            <div className="flex gap-2 mt-2">
               <span
                  className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                     conference.status === "active"
                        ? "bg-green-50 text-green-700"
                        : conference.status === "finished"
                          ? "bg-slate-50 text-slate-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
               >
                  {conference.status === "active" ? "En vivo" : conference.status === "finished" ? "Finalizada" : "Programada"}
               </span>
            </div>
         </div>

         <div className="space-y-3">
            <TransmissionLinkRow
               label="Link de host (transmisión)"
               link={conference.hostTransmissionLink}
               variant="host"
               icon={PlayIcon}
            />
            <TransmissionLinkRow
               label="Link de invitado (transmisión)"
               link={conference.inviteeTransmissionLink}
               variant="invitee"
               icon={LinkIcon}
            />
            {conference.hostQnALink && conference.inviteeQnALink && (
               <>
                  <TransmissionLinkRow label="Link de host (QnA)" link={conference.hostQnALink} variant="host" icon={RadioIcon} />
                  <TransmissionLinkRow
                     label="Link de invitado (QnA)"
                     link={conference.inviteeQnALink}
                     variant="invitee"
                     icon={LinkIcon}
                  />
               </>
            )}
         </div>
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

export default function LiveConferencesBrowser({ conferencesByDay }: LiveConferencesBrowserProps) {
   const [selectedDateKey, setSelectedDateKey] = useState<string>("all");

   const dayTabs = useMemo(() => {
      return conferencesByDay.map((day) => ({
         dateKey: day.date,
         dateLabel: day.dateLabel,
      }));
   }, [conferencesByDay]);

   const visibleConferences = useMemo(() => {
      if (selectedDateKey === "all") {
         return conferencesByDay.flatMap((day) => day.conferences);
      }
      const dayGroup = conferencesByDay.find((d) => d.date === selectedDateKey);
      return dayGroup?.conferences ?? [];
   }, [conferencesByDay, selectedDateKey]);

   return (
      <div className="space-y-6">
         <div role="tablist" aria-label="Filtrar por día" className="flex flex-wrap items-center gap-2">
            <TabButton isActive={selectedDateKey === "all"} onClick={() => setSelectedDateKey("all")} label="Todas" />
            {dayTabs.map((tab) => (
               <TabButton
                  key={tab.dateKey}
                  isActive={selectedDateKey === tab.dateKey}
                  onClick={() => setSelectedDateKey(tab.dateKey)}
                  label={tab.dateLabel}
               />
            ))}
         </div>

         {visibleConferences.length === 0 ? (
            <div className="bg-white shadow-sm p-10 border border-gray-200 border-dashed rounded-xl text-center">
               <p className="text-gray-600">No hay conferencias en vivo para el día seleccionado</p>
            </div>
         ) : (
            <div className="gap-6 grid grid-cols-1">
               {visibleConferences.map((conference) => (
                  <LiveConferenceCard key={conference.id} conference={conference} />
               ))}
            </div>
         )}
      </div>
   );
}
