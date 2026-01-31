"use client";

import { useMemo, useState } from "react";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import type { SpeakerSlidesFileRecord } from "../types/speakerSlidesTypes";
import { ConferenceCard } from "./ConferenceCard";
import { ConferenceSearchInput } from "./ConferenceSearchInput";

interface ConferenceListProps {
   conferencesWithSpeakers: ConferenceWithSpeakers[];
   speakerSlidesFiles: SpeakerSlidesFileRecord[];
}

function getSpeakerDisplayName(speaker: { displayName: string; academicTitle?: string }) {
   if (speaker.academicTitle) {
      return `${speaker.academicTitle} ${speaker.displayName}`;
   }
   return speaker.displayName;
}

export function ConferenceList({ conferencesWithSpeakers, speakerSlidesFiles }: ConferenceListProps) {
   const [searchQuery, setSearchQuery] = useState("");

   const conferencesWithFileStatus = useMemo(() => {
      return conferencesWithSpeakers.map((conferenceWithSpeakers) => {
         const hasFile = speakerSlidesFiles.some((file) => file.conference === conferenceWithSpeakers.conference.id);
         return {
            ...conferenceWithSpeakers,
            hasFile,
         };
      });
   }, [conferencesWithSpeakers, speakerSlidesFiles]);

   const filteredConferences = useMemo(() => {
      if (!searchQuery.trim()) {
         return conferencesWithFileStatus;
      }

      const query = searchQuery.toLowerCase();
      return conferencesWithFileStatus.filter((item) => {
         const conferenceTitleMatch = item.conference.title.toLowerCase().includes(query);
         const speakerNameMatch = item.speakers.some((speaker) =>
            getSpeakerDisplayName(speaker).toLowerCase().includes(query),
         );
         return conferenceTitleMatch || speakerNameMatch;
      });
   }, [conferencesWithFileStatus, searchQuery]);

   return (
      <div className="space-y-6">
         <ConferenceSearchInput value={searchQuery} onChange={setSearchQuery} />

         {filteredConferences.length === 0 ? (
            <div className="bg-white shadow-sm p-10 border border-gray-300 border-dashed rounded-xl text-center">
               <p className="text-gray-600">
                  {searchQuery ? "No se encontraron conferencias que coincidan con la búsqueda" : "No hay conferencias disponibles"}
               </p>
            </div>
         ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {filteredConferences.map((conferenceWithFileStatus) => {
                  const { hasFile, ...conferenceWithSpeakers } = conferenceWithFileStatus;
                  return (
                     <ConferenceCard
                        key={conferenceWithSpeakers.conference.id}
                        conferenceWithSpeakers={conferenceWithSpeakers}
                        hasFile={hasFile}
                     />
                  );
               })}
            </div>
         )}
      </div>
   );
}
