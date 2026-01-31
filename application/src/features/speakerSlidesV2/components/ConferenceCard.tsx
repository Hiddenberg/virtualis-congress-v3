import { format } from "@formkit/tempo";
import { CheckCircle2, Clock, FileText, Mic2, Upload } from "lucide-react";
import Link from "next/link";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";

interface ConferenceCardProps {
   conferenceWithSpeakers: ConferenceWithSpeakers;
   hasFile: boolean;
}

function getSpeakerDisplayName(speaker: { displayName: string; academicTitle?: string }) {
   if (speaker.academicTitle) {
      return `${speaker.academicTitle} ${speaker.displayName}`;
   }
   return speaker.displayName;
}

export function ConferenceCard({ conferenceWithSpeakers, hasFile }: ConferenceCardProps) {
   const { conference, speakers } = conferenceWithSpeakers;

   const startTime = format({
      date: conference.startTime,
      format: "HH:mm",
      tz: "America/Mexico_City",
   });

   const endTime = format({
      date: conference.endTime,
      format: "HH:mm",
      tz: "America/Mexico_City",
   });

   const conferenceDate = format({
      date: conference.startTime,
      format: "DD MMM YYYY",
      tz: "America/Mexico_City",
   });

   const actionHref = hasFile ? `/speakers/slides/${conference.id}/replace` : `/speakers/slides/${conference.id}/upload`;
   const actionLabel = hasFile ? "Reemplazar archivo" : "Subir archivo";
   const ActionIcon = hasFile ? FileText : Upload;

   return (
      <div className="bg-white hover:shadow-md p-5 border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-200">
         <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 text-blue-600">
                     <Clock className="w-4 h-4" />
                     <span className="font-medium text-sm">
                        {conferenceDate} | {startTime} - {endTime}
                     </span>
                  </div>
               </div>
               <h3 className="mb-2 font-semibold text-gray-900 text-lg">{conference.title}</h3>
               {conference.shortDescription && (
                  <p className="mb-3 text-gray-600 text-sm line-clamp-2 leading-relaxed">{conference.shortDescription}</p>
               )}
            </div>
            <div className="ml-4 shrink-0">
               {hasFile ? (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full text-green-700">
                     <CheckCircle2 className="w-4 h-4" />
                     <span className="font-medium text-xs">Archivo subido</span>
                  </div>
               ) : (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-gray-600">
                     <Upload className="w-4 h-4" />
                     <span className="font-medium text-xs">Sin archivo</span>
                  </div>
               )}
            </div>
         </div>

         {speakers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
               {speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-center gap-2 text-gray-700">
                     <Mic2 className="w-4 h-4 text-gray-500" />
                     <span className="text-sm">{getSpeakerDisplayName(speaker)}</span>
                  </div>
               ))}
            </div>
         )}

         <div className="pt-4 border-gray-100 border-t">
            <Link
               href={actionHref}
               className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
            >
               <ActionIcon className="w-4 h-4" />
               {actionLabel}
            </Link>
         </div>
      </div>
   );
}
