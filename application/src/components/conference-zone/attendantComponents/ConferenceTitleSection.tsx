"use client";
import { useQuery } from "@tanstack/react-query";
import { Mic2, Users } from "lucide-react";
import backendFetcher from "@/features/backendFetcher/utils/backendFetcher";
import type { SpeakerDataRecord } from "@/types/congress";

function ConferenceSpeakersSection({ conferenceId }: { conferenceId: string }) {
   const { data, isLoading } = useQuery({
      queryKey: ["conference-speakers", conferenceId],
      queryFn: () => backendFetcher<{ conferenceSpeakers: SpeakerDataRecord[] }>(`/api/conferences/${conferenceId}/speakers`),
   });

   const conferenceSpeakers = data?.conferenceSpeakers;

   if (isLoading) {
      return <div className="flex items-center gap-2 bg-gray-200 rounded-md w-96 h-4 animate-pulse" />;
   }

   if (!conferenceSpeakers) return null;

   if (conferenceSpeakers.length > 0) {
      return (
         <div className="flex items-center gap-2 animate-appear">
            <p className="flex items-center gap-1 font-semibold text-gray-900">
               <Mic2 strokeWidth={3} className="w-4 h-4" /> {conferenceSpeakers.length > 1 ? "Ponentes:" : "Ponente:"}
            </p>
            <p>
               {conferenceSpeakers
                  .map((speaker) =>
                     speaker.academicTitle ? `${speaker.academicTitle} ${speaker.displayName}` : speaker.displayName,
                  )
                  .join(", ")}
            </p>
         </div>
      );
   }
}

export default function ConferenceTitleSection({
   expandedConference,
   isQna,
   conferenceId,
}: {
   expandedConference: CongressConferenceRecord;
   isQna?: boolean;
   conferenceId: string;
}) {
   // const speakerAcademicTitle = getSpeakerAcademicTitleByUserId(expandedConference.speakers[0])

   return (
      <div className="bg-white shadow-sm mb-6 p-2 border border-gray-200 rounded-2xl">
         {/* Conference Header */}
         <div className="flex items-start gap-4">
            {/* Conference Icon */}
            <div className="flex-shrink-0 bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
               <Users className="w-6 h-6 text-white" />
            </div>

            {/* Conference Details */}
            <div className="flex-1 min-w-0">
               <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                     <h1 className="mb-2 font-bold text-gray-900 text-lg leading-tight">
                        {isQna ? "Sesión de preguntas y respuestas" : "Conferencia"}: {expandedConference.title}
                     </h1>

                     {expandedConference.shortDescription && (
                        <p className="text-gray-600 leading-relaxed">{expandedConference.shortDescription}</p>
                     )}
                     <ConferenceSpeakersSection conferenceId={conferenceId} />

                     {/* Conference Meta Information */}
                     {/* <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                        {expandedConference.startTime && (
                           <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                 {new Date(expandedConference.startTime)
                                    .toLocaleString('es-ES', {
                                       day: 'numeric',
                                       month: 'short',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                    })}
                              </span>
                           </div>
                        )}

                        {expandedConference.duration && (
                           <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{expandedConference.duration} min</span>
                           </div>
                        )}
                     </div> */}
                  </div>

                  {/* Status Badge */}
                  {/* <div className="flex-shrink-0">
                     <span className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full font-medium text-green-800 text-sm">
                        En vivo
                     </span>
                  </div> */}
               </div>

               {/* Speaker Information (when available) */}
            </div>
         </div>
      </div>
   );
}
