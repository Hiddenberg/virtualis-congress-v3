import { format } from "@formkit/tempo";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import {
   type ConferenceWithSpeakerNamesAndPhones,
   getAllCongressConferencesByDate,
} from "@/features/conferences/services/conferenceServices";
import { getCongressDates } from "@/features/congresses/services/congressServices";
import ScheduledConferencesSection from "./ScheduledConferencesSection";

export default async function ConferencesDataProvider() {
   // Get all dates for this congress - await directly which allows Suspense to catch the promise
   const dates = await getCongressDates(TEMP_CONSTANTS.CONGRESS_ID);

   // Create a map to store conferences by day with speaker names
   const conferencesByDay: Record<string, ConferenceWithSpeakerNamesAndPhones[]> = {};

   // Fetch conferences for each day with expanded speaker data
   // Using Promise.all to fetch all days in parallel for better performance
   await Promise.all(
      dates.map(async (day) => {
         const dayStr = format(day, "DD-MM-YYYY");
         // Use getAllCongressConferencesByDate which includes the expand parameter for speakers
         const conferences = await getAllCongressConferencesByDate(TEMP_CONSTANTS.CONGRESS_ID, day);
         conferencesByDay[dayStr] = conferences;
      }),
   );

   // Return the client component with the fetched data
   return <ScheduledConferencesSection congressDates={dates} conferencesMap={conferencesByDay} />;
}
