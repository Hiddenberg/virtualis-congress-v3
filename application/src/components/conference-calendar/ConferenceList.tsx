"use client";

import { format } from "@formkit/tempo";
import { RecordModel } from "pocketbase";
import { useState } from "react";
import { ConferenceWithSpeakerNamesAndPhones } from "@/features/conferences/services/conferenceServices";
import { ConferenceRecording } from "@/types/congress";
import AdminConferenceCard from "./AdminConfernceCard";

// Recording status options for filtering
const RECORDING_STATUS_OPTIONS: Array<ConferenceRecording["status"] | "all"> = [
   "all",
   "pending",
   "recording",
   "uploading",
   "processing",
   "available",
   "failed",
];

// Readable status names
const STATUS_DISPLAY_NAMES: Record<
   ConferenceRecording["status"] | "all",
   string
> = {
   all: "Todos",
   pending: "Pendiente",
   recording: "Grabando",
   uploading: "Subiendo",
   processing: "Procesando",
   available: "Grabada",
   failed: "Error",
};

export default function ConferenceList({
   conferences,
   conferenceRecordings,
   conferenceDate,
}: {
   conferences: (ConferenceWithSpeakerNamesAndPhones & RecordModel)[];
   conferenceRecordings: Record<string, (ConferenceRecording & RecordModel)[]>;
   conferenceDate: Date;
}) {
   const [statusFilter, setStatusFilter] = useState<
      ConferenceRecording["status"] | "all"
   >("all");

   // Filter conferences based on recording status
   const filteredConferences = conferences.filter((conference) => {
      // If filter is set to "all", show all conferences
      if (statusFilter === "all") return true;

      // Get recordings for this conference
      const recordings = conferenceRecordings[conference.id] || [];

      // Check if any recording matches the filter status
      return recordings.some((recording) => recording.status === statusFilter);
   });

   // Calculate status counts for each category
   const statusCounts: Record<ConferenceRecording["status"] | "all", number> = {
      all: conferences.length,
      pending: 0,
      recording: 0,
      uploading: 0,
      processing: 0,
      available: 0,
      failed: 0,
   };

   // Count conferences for each status
   conferences.forEach((conference) => {
      const recordings = conferenceRecordings[conference.id] || [];

      // Check for each status
      RECORDING_STATUS_OPTIONS.forEach((status) => {
         if (status !== "all") {
            // For specific statuses, check if any recording has this status
            if (recordings.some((recording) => recording.status === status)) {
               statusCounts[status]++;
            }
         }
      });
   });

   return (
      <div className="flex flex-col gap-4 w-full">
         <span className="block text-center capitalize">
            {format(conferenceDate, "dddd DD MMMM", "es-MX")}
         </span>

         {/* Filter Bar */}
         <div className="bg-white shadow mb-4 p-4 rounded-lg">
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
               <h3 className="font-medium text-gray-700 text-sm">
                  Filtrar por estado de grabación:
               </h3>
               <div className="flex flex-wrap gap-2">
                  {RECORDING_STATUS_OPTIONS.map((status) => (
                     <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                           statusFilter === status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } flex items-center gap-1`}
                     >
                        <span>{STATUS_DISPLAY_NAMES[status]}</span>
                        <span
                           className={`inline-flex items-center justify-center rounded-full text-xs ${
                              statusFilter === status
                                 ? "bg-blue-500 text-white"
                                 : "bg-gray-200 text-gray-700"
                           } min-w-5 h-5 px-1`}
                        >
                           {statusCounts[status]}
                        </span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Conferences List */}
         {filteredConferences.length > 0 ? (
            filteredConferences.map((conference) => (
               <AdminConferenceCard
                  key={conference.id}
                  conference={conference}
                  conferenceRecordings={
                     conferenceRecordings[conference.id] || []
                  }
               />
            ))
         ) : (
            <div className="bg-gray-50 py-10 rounded-lg text-center">
               <p className="text-gray-500">
                  No hay conferencias que coincidan con el filtro seleccionado.
               </p>
            </div>
         )}
      </div>
   );
}
