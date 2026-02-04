"use client";

import { format } from "@formkit/tempo";
import { Clock, User, Users } from "lucide-react";
import { useState } from "react";
import type { QnALiveWithDetails } from "@/services/serverAggregators/livestreamAggregators";
import { Button, CopyButton, LinkButton } from "../global/Buttons";

// Extending the interface to include potentially missing properties
interface ExtendedSessionData extends QnALiveWithDetails {
   conferenceShortDescription?: string;
}

export default function QnASessionsList({ livestreamSessions }: { livestreamSessions: QnALiveWithDetails[] }) {
   const livestreamSessionsGroupedByDay = livestreamSessions.reduce(
      (acc, session) => {
         const sessionDay = format({
            date: session.conferenceStartTime,
            format: "ddd DD",
            tz: "America/Mexico_City",
         });

         if (!acc.some((group) => group.day === sessionDay)) {
            acc.push({
               day: sessionDay,
               sessions: [],
            });
         }

         const dayGroup = acc.find((group) => group.day === sessionDay);
         if (dayGroup) {
            dayGroup.sessions.push(session as ExtendedSessionData);
         }

         return acc;
      },
      [] as {
         day: string;
         sessions: ExtendedSessionData[];
      }[],
   );

   const [selectedDay, setSelectedDay] = useState<string | null>(
      livestreamSessionsGroupedByDay.length > 0 ? livestreamSessionsGroupedByDay[0].day : null,
   );

   // Sort sessions by start time
   const sortSessionsByTime = (sessions: ExtendedSessionData[]) => {
      return [...sessions].sort((a, b) => new Date(a.conferenceStartTime).getTime() - new Date(b.conferenceStartTime).getTime());
   };

   // Get selected day's sessions
   const selectedDaySessions = selectedDay
      ? sortSessionsByTime(livestreamSessionsGroupedByDay.find((day) => day.day === selectedDay)?.sessions || [])
      : [];

   return (
      <div className="w-full">
         {/* Day Selection Tabs */}
         <div className="flex gap-2 mb-6 pb-2 overflow-x-auto scrollbar-thin">
            {livestreamSessionsGroupedByDay.map((day) => {
               const isSelected = day.day === selectedDay;
               return (
                  <Button
                     variant={isSelected ? "primary" : "dark"}
                     key={day.day}
                     onClick={() => setSelectedDay(day.day)}
                     className={`px-6 py-3 ${isSelected ? "shadow-md" : ""}`}
                  >
                     {day.day}
                  </Button>
               );
            })}
         </div>

         {/* Sessions List */}
         <div className="space-y-6">
            {selectedDaySessions.map((session) => (
               <div key={session.id} className="bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden">
                  {/* Status Badge */}
                  <div className="bg-gray-50 px-4 py-2 border-gray-100 border-b">
                     <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                           session.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : session.status === "streaming"
                                ? "bg-green-100 text-green-800"
                                : session.status === "preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : session.status === "ended"
                                    ? "bg-gray-100 text-gray-800"
                                    : session.status === "paused"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                        }`}
                     >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                     </span>
                  </div>

                  <div className="p-4">
                     {/* Session Title */}
                     <h3 className="mb-2 font-bold text-gray-900 text-xl">{session.conferenceTitle}</h3>

                     {/* Session Time */}
                     <div className="flex items-center mb-3 text-gray-600">
                        <Clock className="mr-2 w-4 h-4" />
                        <span>
                           {format({
                              date: session.conferenceStartTime,
                              format: "h:mm a",
                              tz: "America/Mexico_City",
                           })}
                           {" - "}
                           {format({
                              date: session.conferenceEndTime,
                              format: "h:mm a",
                              tz: "America/Mexico_City",
                           })}
                        </span>
                     </div>

                     {/* Session Description */}
                     {session.conferenceShortDescription && (
                        <p className="mb-4 text-gray-600">{session.conferenceShortDescription}</p>
                     )}

                     <div className="flex flex-wrap gap-3 mb-4">
                        {/* Speakers */}
                        {session.speakersNames && session.speakersNames.length > 0 && (
                           <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                              <Users className="mr-2 w-4 h-4 text-gray-500" />
                              <span className="font-medium text-sm">Conferencista: {session.speakersNames.join(", ")}</span>
                           </div>
                        )}

                        {/* Presenter */}
                        {session.presenterName && (
                           <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                              <User className="mr-2 w-4 h-4 text-gray-500" />
                              <span className="font-medium text-sm">Presentador: {session.presenterName}</span>
                           </div>
                        )}
                     </div>

                     {/* Join Session Link */}

                     <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                           <div className="bg-gray-50 px-3 py-2 border-gray-200 border-r">
                              <span className="font-medium text-gray-600 text-sm">Link de Host:</span>
                           </div>
                           <div className="grow bg-white px-3 py-2">
                              <code className="font-mono text-gray-800 text-sm">
                                 https://acp-congress.virtualis.app/QnA-transmission/
                                 {session.conferenceId}?ishost=true
                              </code>
                           </div>
                           <div className="bg-white py-2 pr-3 pl-1">
                              <CopyButton text={`/QnA-transmission/${session.conferenceId}?ishost=true`} />
                           </div>
                        </div>

                        <LinkButton
                           href={`/QnA-transmission/${session.conferenceId}?ishost=true`}
                           variant="primary"
                           className="px-4 py-2"
                        >
                           Unirse a la sesión como host
                        </LinkButton>
                     </div>

                     <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                           <div className="bg-gray-50 px-3 py-2 border-gray-200 border-r">
                              <span className="font-medium text-gray-600 text-sm">Link de conferencista:</span>
                           </div>
                           <div className="grow bg-white px-3 py-2">
                              <code className="font-mono text-gray-800 text-sm">
                                 https://acp-congress.virtualis.app/QnA-transmission/
                                 {session.conferenceId}
                              </code>
                           </div>
                           <div className="bg-white py-2 pr-3 pl-1">
                              <CopyButton text={`/QnA-transmission/${session.conferenceId}`} />
                           </div>
                        </div>

                        <LinkButton href={`/QnA-transmission/${session.conferenceId}`} variant="primary" className="px-4 py-2">
                           Unirse a la sesión como conferencista
                        </LinkButton>
                     </div>
                  </div>
               </div>
            ))}

            {selectedDaySessions.length === 0 && selectedDay && (
               <div className="bg-gray-50 p-8 rounded-xl text-center">
                  <p className="text-gray-600">No sessions scheduled for this day.</p>
               </div>
            )}
         </div>
      </div>
   );
}
