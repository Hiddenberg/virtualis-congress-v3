"use client";

import { format, isAfter, isBefore } from "@formkit/tempo";
import { ChevronDown, Clock, Mic } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LobbyConference } from "@/services/serverAggregators/conferenceAggregators";

interface DayConferences {
   date: Date;
   conferences: LobbyConference[];
}

const CONFERENCE_COLORS = [
   "bg-green-100",
   "bg-blue-100",
   "bg-purple-100",
   "bg-pink-100",
   "bg-yellow-100",
   "bg-red-100",
   "bg-orange-100",
   "bg-teal-100",
   "bg-gray-100",
   "bg-indigo-100",
];

/**
 * Component to display a single conference card
 */
function ConferenceCard({
   conference,
   colorIndex,
}: {
   conference: LobbyConference;
   colorIndex: number;
}) {
   const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentTime(new Date());
      }, 60000);
      return () => clearInterval(interval);
   }, []);
   const isConferenceActive =
      isAfter(currentTime.toISOString(), conference.startTime) &&
      isBefore(currentTime.toISOString(), conference.endTime);
   const isConferencePast = isBefore(
      conference.endTime,
      currentTime.toISOString(),
   );

   return (
      <Link
         key={conference.id}
         href={`/conference/${conference.id}`}
         className={`${CONFERENCE_COLORS[colorIndex]} rounded-lg p-3 sm:p-4 shadow relative overflow-hidden transition-all hover:shadow-md flex-grow basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-80`}
      >
         {isConferenceActive && (
            <div className="top-0 right-0 absolute bg-green-500 px-2 py-1 rounded-bl font-semibold text-white text-xs">
               En vivo
            </div>
         )}
         {isConferencePast && (
            <div className="top-0 right-0 absolute bg-gray-500 px-2 py-1 rounded-bl font-semibold text-white text-xs">
               Finalizada
            </div>
         )}

         <div className="flex items-center mb-2 w-full text-gray-700">
            <Clock className="mr-1 w-3 sm:w-4 h-3 sm:h-4" />
            <span className="font-bold text-base sm:text-xl">
               {format({
                  date: conference.startTime,
                  format: "HH:mm",
                  tz: "America/Mexico_City",
               })}
            </span>
            <span className="ml-1 text-xs sm:text-sm">
               /{" "}
               {format({
                  date: conference.endTime,
                  format: "HH:mm",
                  tz: "America/Mexico_City",
               })}{" "}
               hrs
            </span>
         </div>
         <h3 className="mb-2 font-semibold text-gray-800 text-sm sm:text-base">
            {conference.title}
         </h3>
         {conference.shortDescription && (
            <p className="mb-2 text-gray-600 text-xs sm:text-sm line-clamp-2">
               {conference.shortDescription}
            </p>
         )}
         <div className="flex items-center mt-auto text-gray-600">
            <Mic className="flex-shrink-0 mr-1 w-3 sm:w-4 h-3 sm:h-4" />
            <span className="text-xs sm:text-sm line-clamp-1">
               {conference.speakerNames.join(", ")}
            </span>
         </div>
      </Link>
   );
}

/**
 * Component to display a day header
 */
function DayHeader({ date, dayIndex }: { date: Date; dayIndex: number }) {
   return (
      <div className="flex items-center bg-white px-2 sm:px-0 py-2">
         <Clock className="flex-shrink-0 mr-2 w-4 sm:w-5 h-4 sm:h-5 text-teal-600" />
         <h2 className="font-semibold text-teal-600 text-base sm:text-xl truncate">
            {format({
               date: date,
               format: "dddd DD",
               locale: "es-MX",
               tz: "America/Mexico_City",
            })}
         </h2>
         <span className="ml-2 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
            Día {dayIndex + 1}
         </span>
      </div>
   );
}

/**
 * Component to display all conferences for a single day
 */
function DayConferencesList({
   dayConferences,
   dayIndex,
}: {
   dayConferences: DayConferences;
   dayIndex: number;
}) {
   const [isExpanded, setIsExpanded] = useState(false);

   return (
      <div
         key={format({
            date: dayConferences.date,
            format: "YYYY-MM-DD",
            tz: "America/Mexico_City",
         })}
         className="mb-4 sm:mb-6"
      >
         <button
            className="flex justify-between items-center mb-2 p-2 md:px-4 border border-gray-200 rounded-lg w-full"
            onClick={() => setIsExpanded(!isExpanded)}
         >
            <DayHeader date={dayConferences.date} dayIndex={dayIndex} />
            <p className="text-gray-500 text-xs">
               Toca para ver las conferencias
            </p>
            <ChevronDown
               className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
         </button>

         {isExpanded && (
            <div className={`flex flex-wrap gap-2 w-full`}>
               {dayConferences.conferences.map((conference, idx) => {
                  const colorIndex = idx % CONFERENCE_COLORS.length;
                  return (
                     <ConferenceCard
                        key={conference.id}
                        conference={conference}
                        colorIndex={colorIndex}
                     />
                  );
               })}
            </div>
         )}
      </div>
   );
}

/**
 * Utility to group conferences by day
 */
function organizeConferencesByDay(
   lobbyConferences: LobbyConference[],
): DayConferences[] {
   const conferencesByDay: DayConferences[] = [];

   if (!lobbyConferences || lobbyConferences.length === 0) {
      return conferencesByDay;
   }

   // Group conferences by day, handling timezone correctly
   const groupedByDay = new Map<string, LobbyConference[]>();

   lobbyConferences.forEach((conference) => {
      // Create date in local timezone but preserve the day/month/year from the UTC date
      const startDate = new Date(conference.startTime);
      const dateKey = format({
         date: startDate,
         format: "YYYY-MM-DD",
         tz: "America/Mexico_City",
      });

      if (!groupedByDay.has(dateKey)) {
         groupedByDay.set(dateKey, []);
      }

      groupedByDay.get(dateKey)?.push(conference);
   });

   // Convert map to array and sort by date
   groupedByDay.forEach((conferences, dateKey) => {
      // Sort conferences by start time
      const sortedConferences = conferences.sort(
         (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );

      // Create date from dateKey in local timezone
      const [year, month, day] = dateKey.split("-").map((n) => parseInt(n, 10));
      const localDate = new Date(year, month - 1, day);

      conferencesByDay.push({
         date: localDate,
         conferences: sortedConferences,
      });
   });

   // Sort days by date
   return conferencesByDay.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Main component that displays all conference sessions
 */
export default function SessionSchedulesSection({
   lobbyConferences,
}: {
   lobbyConferences: LobbyConference[];
}) {
   const conferencesByDay = organizeConferencesByDay(lobbyConferences);

   if (conferencesByDay.length === 0) {
      return (
         <div className="mx-auto p-2 sm:p-4 w-full text-center">
            No hay conferencias programadas
         </div>
      );
   }

   return (
      <div className="mx-auto p-2 sm:p-4 w-full">
         <div className="space-y-6 sm:space-y-8">
            {conferencesByDay.map((dayConferences, dayIndex) => (
               <DayConferencesList
                  key={format({
                     date: dayConferences.date,
                     format: "YYYY-MM-DD",
                     tz: "America/Mexico_City",
                  })}
                  dayConferences={dayConferences}
                  dayIndex={dayIndex}
               />
            ))}
         </div>
      </div>
   );
}
