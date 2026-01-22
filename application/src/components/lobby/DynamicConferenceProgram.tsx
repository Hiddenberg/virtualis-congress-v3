"use client";

import { format, isAfter, isBefore } from "@formkit/tempo";
import { Calendar, ChevronDown, ChevronUp, Clock, Coffee, Mic2, Play, Users, Video } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LinkButton } from "@/components/global/Buttons";
import type { ConferenceWithSpeakersAndDurations } from "@/features/conferences/aggregators/conferenceAggregators";

// Types for conference types

interface ConferenceItemProps {
   conferenceWithSpeakersAndDurations: ConferenceWithSpeakersAndDurations;
   isEnded: boolean;
   currentDateTime: Date;
}

function StatusBadge({ status }: { status: CongressConference["status"] }) {
   switch (status) {
      case "active":
         return (
            <div className="flex items-center gap-1 text-red-600 text-xs">
               <div className="bg-red-400 rounded-full w-2 h-2 animate-pulse" />
               <span>En vivo</span>
            </div>
         );
      case "scheduled":
         return (
            <div className="flex items-center gap-1 text-green-600 text-xs">
               <div className="bg-green-400 rounded-full w-2 h-2" />
               <span>Programada</span>
            </div>
         );
      case "finished":
         return (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
               <div className="bg-gray-400 rounded-full w-2 h-2" />
               <span>Finalizada</span>
            </div>
         );
      case "canceled":
         return (
            <div className="flex items-center gap-1 text-rose-600 text-xs">
               <div className="bg-rose-400 rounded-full w-2 h-2" />
               <span>Cancelada</span>
            </div>
         );
      default:
         return null;
   }
}

function ConferenceTypeIcon({ type }: { type: CongressConference["conferenceType"] }) {
   const iconProps = "w-4 h-4";

   switch (type) {
      case "in-person":
         return <Users className={iconProps} />;
      case "livestream":
         return <Video className={iconProps} />;
      case "pre-recorded":
         return <Play className={iconProps} />;
      case "simulated_livestream":
         return <Video className={iconProps} />;
      case "break":
         return <Coffee className={iconProps} />;
      default:
         return <Calendar className={iconProps} />;
   }
}

function ConferenceTypeLabel({ type }: { type: CongressConference["conferenceType"] }) {
   switch (type) {
      case "in-person":
         return "Conferencia Presencial";
      case "livestream":
         return "Transmisión en Vivo";
      case "pre-recorded":
         return "Conferencia Pregrabada";
      case "simulated_livestream":
         return "Transmisión en Vivo";
      case "break":
         return "Descanso";
      default:
         return "Conferencia";
   }
}

function ConferenceItem({ conferenceWithSpeakersAndDurations, isEnded, currentDateTime }: ConferenceItemProps) {
   const conference = conferenceWithSpeakersAndDurations.conference;
   const startTime = format({
      date: conference.startTime,
      format: "hh:mm A",
      locale: "es-MX",
   });

   const endTime = format({
      date: conference.endTime,
      format: "hh:mm A",
      locale: "es-MX",
   });

   const formattedDate = format({
      date: conference.startTime,
      format: "DD MMM",
      locale: "es-MX",
   });

   const isBreak = conference.conferenceType === "break";
   const conferenceLink = `/conference/${conference.id}`;

   const isJoinDisabled = isEnded || conference.status === "canceled";

   const getPreRecordedConferenceStatus = useCallback(
      (conference: ConferenceWithSpeakersAndDurations): CongressConference["status"] => {
         const conferenceType = conference.conference.conferenceType;

         // For livestream and in-person conferences, and for pre-recorded conferences without pre-recorded data, the status is the same as the conference status
         if (conferenceType === "livestream" || conferenceType === "in-person" || !conference.preRecordedData) {
            return conference.conference.status;
         }

         // For pre-recorded conferences with pre-recorded data, we need to check the real end date
         // If the current date is after the conference start date and before the conference end date, the status is active
         if (
            isAfter(currentDateTime, conference.conference.startTime) &&
            isBefore(currentDateTime, conference.preRecordedData.realEndDate)
         ) {
            return "active";
         }

         // If the current date is before the conference start date, the status is scheduled
         if (isBefore(currentDateTime, conference.conference.startTime)) {
            return "scheduled";
         }

         return "finished";
      },
      [currentDateTime],
   );

   const conferenceCardStatus = getPreRecordedConferenceStatus(conferenceWithSpeakersAndDurations);

   return (
      <div
         className={`relative bg-white border rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${
            isEnded ? "opacity-70 border-gray-200" : "border-blue-100 hover:border-blue-200"
         }`}
      >
         {/* Status indicator */}
         <div className="top-4 right-4 absolute">
            <StatusBadge status={isEnded ? "finished" : conferenceCardStatus} />
         </div>

         <div className="pr-20">
            {/* Time and type */}
            <div className="flex items-center gap-3 mb-3">
               <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm whitespace-nowrap">
                     {formattedDate} | {startTime} - {endTime}
                  </span>
               </div>
               <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-full">
                  <ConferenceTypeIcon type={conference.conferenceType} />
                  <span className="hidden sm:inline font-medium text-blue-700 text-xs">
                     <ConferenceTypeLabel type={conference.conferenceType} />
                  </span>
               </div>
            </div>

            {/* Title and description */}
            <div className="mb-3">
               <h3 className="mb-1 font-semibold text-gray-900 text-lg">{conference.title}</h3>
               {conference.shortDescription && (
                  <p className="text-gray-600 text-sm leading-relaxed">{conference.shortDescription}</p>
               )}
               {conferenceWithSpeakersAndDurations.speakers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                     {conferenceWithSpeakersAndDurations.speakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-center gap-2">
                           <Mic2 className="w-4 h-4" />{" "}
                           <p>
                              {speaker.academicTitle ? `${speaker.academicTitle} ${speaker.displayName}` : speaker.displayName}
                           </p>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Action button - only for non-break conferences */}
            {!isBreak && (
               <div className="mt-4">
                  <LinkButton
                     variant={conferenceCardStatus === "active" ? "green" : "blue"}
                     href={conferenceLink}
                     className={`w-full sm:w-auto text-sm block py-2 px-4 ${isJoinDisabled ? "opacity-75" : ""}`}
                     disabled={isJoinDisabled}
                  >
                     <Play className="w-4 h-4" />
                     Unirse a la Conferencia
                  </LinkButton>
               </div>
            )}
         </div>
      </div>
   );
}

export default function DynamicConferenceProgram({
   allCongressConferencesWithSpeakersAndDurations,
}: {
   allCongressConferencesWithSpeakersAndDurations: ConferenceWithSpeakersAndDurations[];
}) {
   const [currentDateTime, setCurrentDateTime] = useState(new Date());
   const [showEndedConferences, setShowEndedConferences] = useState(true);

   // Get unique dates from all conferences
   const uniqueDates = useMemo(() => {
      return Array.from(
         new Set(
            allCongressConferencesWithSpeakersAndDurations.map((conf) =>
               format({
                  date: conf.conference.startTime,
                  format: "DD MMM",
                  locale: "es-MX",
               }),
            ),
         ),
      ).sort();
   }, [allCongressConferencesWithSpeakersAndDurations]);
   const [selectedDate, setSelectedDate] = useState<string | null>(() => {
      const currentDate = new Date();
      const currentDateFormatted = format({
         date: currentDate,
         format: "DD MMM",
         locale: "es-MX",
      });

      if (uniqueDates.includes(currentDateFormatted)) {
         return currentDateFormatted;
      }

      if (uniqueDates.length > 0) {
         return uniqueDates[0];
      }

      return null;
   });

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentDateTime(new Date());
      }, 10000);
      return () => clearInterval(interval);
   }, []);

   // Filter conferences by selected date if any
   const filteredConferences = selectedDate
      ? allCongressConferencesWithSpeakersAndDurations.filter(
           (conf) =>
              format({
                 date: conf.conference.startTime,
                 format: "DD MMM",
                 locale: "es-MX",
              }) === selectedDate,
        )
      : allCongressConferencesWithSpeakersAndDurations;

   // Separate conferences by status
   const endedConferences = useMemo(() => {
      return filteredConferences.filter((conf) => {
         const conferenceType = conf.conference.conferenceType;
         if (conferenceType === "livestream" || conferenceType === "in-person") {
            return conf.conference.status === "finished" || conf.conference.status === "canceled";
         }

         if (conferenceType === "break") {
            return isAfter(currentDateTime, conf.conference.endTime);
         }
         // For pre-recorded conferences, we need to check the real end date
         if (conferenceType === "simulated_livestream" || conferenceType === "pre-recorded") {
            if (!conf.preRecordedData) {
               return isAfter(currentDateTime, conf.conference.endTime);
            }

            return isAfter(currentDateTime, conf.preRecordedData.realEndDate);
         }

         return false;
      });
   }, [filteredConferences, currentDateTime]);

   const activeConferences = filteredConferences.filter((conf) => {
      return !endedConferences.includes(conf);
   });

   // Group conferences by date
   const groupConferencesByDate = (conferences: ConferenceWithSpeakersAndDurations[]) => {
      const grouped = conferences.reduce(
         (acc, conf) => {
            const dateKey = format({
               date: conf.conference.startTime,
               format: "DD MMM",
               locale: "es-MX",
            });
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(conf);
            return acc;
         },
         {} as Record<string, ConferenceWithSpeakersAndDurations[]>,
      );

      // Sort conferences within each date by start time
      Object.keys(grouped).forEach((date) => {
         grouped[date].sort((a, b) => new Date(a.conference.startTime).getTime() - new Date(b.conference.startTime).getTime());
      });

      return grouped;
   };

   const groupedActiveConferences = groupConferencesByDate(activeConferences);
   const groupedEndedConferences = groupConferencesByDate(endedConferences);

   // Sort dates
   const sortedActiveDates = Object.keys(groupedActiveConferences).sort();
   const sortedEndedDates = Object.keys(groupedEndedConferences).sort().reverse();

   return (
      <div className="mx-auto p-4 w-full max-w-4xl">
         {/* Header */}
         <div className="mb-6">
            <h2 className="mb-2 font-bold text-gray-900 text-2xl md:text-3xl">Programa de Conferencias</h2>
            <p className="text-gray-600">Horarios y enlaces para todas las conferencias del congreso</p>
         </div>

         {/* Date Filter Buttons */}
         {uniqueDates.length > 1 && (
            <div className="mb-6">
               <h3 className="mb-3 font-medium text-gray-900 text-sm">Filtrar por día:</h3>
               <div className="flex flex-wrap gap-2">
                  {/* <button
                     onClick={() => setSelectedDate(null)}
                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedDate === null
                           ? 'bg-blue-500 text-white'
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                     }`}
                  >
                     Todos los días
                  </button> */}
                  {uniqueDates.map((date) => (
                     <button
                        type="button"
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                           selectedDate === date ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                     >
                        {date}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* Ended Conferences Section */}
         {endedConferences.length > 0 && (
            <div className="pt-6 border-gray-200 border-t">
               <button
                  type="button"
                  onClick={() => setShowEndedConferences(!showEndedConferences)}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 mb-4 p-4 rounded-lg w-full transition-colors duration-200"
               >
                  <div className="flex items-center gap-2">
                     <div className="bg-gray-400 rounded-full w-3 h-3" />
                     <span className="font-semibold text-gray-700">Conferencias Finalizadas ({endedConferences.length})</span>
                  </div>
                  {showEndedConferences ? (
                     <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                     <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
               </button>

               {showEndedConferences && (
                  <div className="space-y-6">
                     {sortedEndedDates.map((date) => (
                        <div key={date} className="space-y-4">
                           {/* Date Header */}
                           <div className="flex items-center gap-3 pb-2 border-gray-200 border-b">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <span className="bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-600 text-xs">
                                 {groupedEndedConferences[date].length} conferencia
                                 {groupedEndedConferences[date].length !== 1 ? "s" : ""}
                              </span>
                           </div>

                           {/* Conferences for this date */}
                           <div className="space-y-4 pl-8">
                              {groupedEndedConferences[date].map((conference) => (
                                 <ConferenceItem
                                    key={conference.conference.id}
                                    conferenceWithSpeakersAndDurations={conference}
                                    isEnded={true}
                                    currentDateTime={currentDateTime}
                                 />
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Active/Upcoming Conferences */}
         <div className="mb-8">
            <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900 text-lg">
               <div className="bg-green-400 rounded-full w-3 h-3 animate-pulse" />
               Conferencias Programadas ({activeConferences.length})
            </h3>

            {sortedActiveDates.length > 0 ? (
               <div className="space-y-6">
                  {sortedActiveDates.map((date) => (
                     <div key={date} className="space-y-4">
                        {/* Conferences for this date */}
                        <div className="space-y-4">
                           {groupedActiveConferences[date].map((conferenceWithSpeakersAndDurations) => (
                              <ConferenceItem
                                 key={conferenceWithSpeakersAndDurations.conference.id}
                                 conferenceWithSpeakersAndDurations={conferenceWithSpeakersAndDurations}
                                 isEnded={false}
                                 currentDateTime={currentDateTime}
                              />
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl text-center">
                  <Calendar className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                  <p className="text-gray-600">
                     {selectedDate
                        ? "No hay más conferencias programadas para este día"
                        : "No hay conferencias programadas en este momento"}
                  </p>
               </div>
            )}
         </div>

         {/* Footer info */}
         <div className="bg-blue-50 mt-8 p-4 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 mt-0.5">
                  <div className="bg-blue-400 rounded-full w-2 h-2" />
               </div>
               <div className="text-blue-800 text-sm">
                  <p className="mb-1 font-medium">Información importante:</p>
                  <ul className="space-y-1 text-blue-700">
                     <li>• Las grabaciones estarán disponibles al terminar el evento</li>
                     <li>• Los horarios están en zona horaria de México (America/Mexico_City)</li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
