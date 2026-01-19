import { tzDate } from "@formkit/tempo";
import { RecordModel } from "pocketbase";
import AdminConfernceCard from "@/components/conference-calendar/AdminConfernceCard";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import {
   ConferenceWithSpeakerNamesAndPhones,
   getAllCongressConferencesByDate,
} from "@/features/conferences/services/conferenceServices";
import { getConferenceRecordings } from "@/services/recordingServices";

export const dynamic = "force-dynamic";

export default async function InaugurationMessagesPage() {
   const conferencesForInauguration = await getAllCongressConferencesByDate(
      TEMP_CONSTANTS.CONGRESS_ID,
      tzDate("2025-04-13", "America/Mexico_City"),
   );

   if (conferencesForInauguration.length === 0) {
      return (
         <div>
            <h1 className="font-bold text-3xl">
               No conferences for inauguration
            </h1>
         </div>
      );
   }

   return (
      <div>
         <h1 className="font-bold text-3xl">Inauguration Messages</h1>

         <div className="flex flex-col gap-4">
            {conferencesForInauguration.map(async (conference) => {
               const typedConference =
                  conference as ConferenceWithSpeakerNamesAndPhones &
                     RecordModel;
               const conferenceRecordings = await getConferenceRecordings(
                  typedConference.id,
               );
               return (
                  <AdminConfernceCard
                     key={conference.id}
                     conference={conference}
                     conferenceRecordings={conferenceRecordings!}
                  />
               );
            })}
         </div>
      </div>
   );
}
