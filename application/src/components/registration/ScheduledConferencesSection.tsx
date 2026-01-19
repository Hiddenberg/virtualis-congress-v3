"use client";

import { format, isEqual } from "@formkit/tempo";
import { CalendarClock, Clock, Users } from "lucide-react";
import { useState } from "react";
import type { ConferenceWithSpeakerNamesAndPhones } from "@/features/conferences/services/conferenceServices";

type ScheduledConferencesSectionProps = {
   congressDates: Date[];
   conferencesMap: Record<string, ConferenceWithSpeakerNamesAndPhones[]>;
};

export default function ScheduledConferencesSection({
   congressDates,
   conferencesMap,
}: ScheduledConferencesSectionProps) {
   const [selectedDay, setSelectedDay] = useState<Date | null>(
      congressDates.length > 0 ? congressDates[0] : null,
   );

   const handleDaySelect = (day: Date) => {
      setSelectedDay(day);
   };

   const selectedDayFormatted = selectedDay
      ? format(selectedDay, "DD-MM-YYYY")
      : "";
   const selectedDayConferences = selectedDay
      ? conferencesMap[selectedDayFormatted] || []
      : [];

   // Function to calculate duration in minutes
   const getDurationInMinutes = (startTime: string, endTime: string) => {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
   };

   // Function to format duration to human readable format
   const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours === 0) {
         return `${mins} minutos`;
      } else if (mins === 0) {
         return `${hours} hora${hours > 1 ? "s" : ""}`;
      } else {
         return `${hours} hora${hours > 1 ? "s" : ""} y ${mins} minutos`;
      }
   };

   return (
      <section className="px-4 md:px-10 py-12">
         <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
               <h2 className="mb-4 font-bold text-blue-900 text-3xl">
                  Conferencias Programadas
               </h2>
               <p className="mb-8 text-gray-600">
                  Selecciona un día para ver las conferencias programadas
               </p>

               {/* Day selector */}
               <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {congressDates.map((day) => (
                     <button
                        key={format(day, "DD-MM-YYYY")}
                        onClick={() => handleDaySelect(day)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border border-blue-400 transition-colors ${
                           selectedDay && isEqual(day, selectedDay)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                     >
                        {format(day, "ddd DD MMM", "es-MX")}
                     </button>
                  ))}
               </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 h-[30rem] overflow-y-auto">
               {selectedDayConferences.length > 0 ? (
                  selectedDayConferences.map((conference, index) => {
                     const durationMinutes = getDurationInMinutes(
                        conference.startTime,
                        conference.endTime,
                     );
                     return (
                        <div
                           key={`conference-${index}-${conference.title}`}
                           className="bg-white shadow-sm hover:shadow-md p-6 border border-blue-100 rounded-xl transition-shadow"
                        >
                           <h3 className="mb-2 font-bold text-blue-900 text-lg">
                              {conference.title}
                           </h3>
                           <p className="mb-4 text-gray-600">
                              {conference.shortDescription}
                           </p>

                           <div className="flex flex-col space-y-4">
                              {/* Time information */}
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                 <div className="flex items-center">
                                    <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
                                       <CalendarClock
                                          size={20}
                                          className="text-blue-700"
                                       />
                                       <span className="font-semibold text-blue-800 text-base">
                                          {format(
                                             new Date(conference.startTime),
                                             "hh:mm A",
                                             "es-MX",
                                          )}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 text-blue-700">
                                 <Clock size={18} />
                                 <p className="text-sm">Duración:</p>
                                 <span className="text-sm">
                                    {formatDuration(durationMinutes)}
                                 </span>
                              </div>

                              {/* Speakers section */}
                              <div className="flex items-start gap-2">
                                 <Users
                                    size={18}
                                    className="flex-shrink-0 mt-1 text-blue-700"
                                 />
                                 <div className="flex flex-col">
                                    <span className="font-medium text-blue-800 text-sm">
                                       {conference.speakers?.length > 1
                                          ? "Ponentes:"
                                          : "Ponente:"}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                       {conference.speakers &&
                                       conference.speakers.length > 0 ? (
                                          conference.speakersDetails.map(
                                             (speaker, index) => (
                                                <span
                                                   key={index}
                                                   className="bg-blue-50 px-2 py-1 rounded-md text-blue-700 text-xs"
                                                >
                                                   {speaker.name}
                                                </span>
                                             ),
                                          )
                                       ) : (
                                          <span className="text-gray-500 text-sm">
                                             No hay ponentes asignados
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="col-span-full bg-gray-50 py-10 rounded-xl text-center">
                     <p className="text-gray-500">
                        No hay conferencias programadas para este día
                     </p>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
