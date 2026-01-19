import { date } from "@formkit/tempo";
import { RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import {
   ConferenceWithSpeakerNamesAndPhones,
   getAllCongressConferencesByDate,
} from "@/features/conferences/services/conferenceServices";
import { getConferenceRecordings } from "@/services/recordingServices";
import { ConferenceRecording } from "@/types/congress";
import ConferenceList from "./ConferenceList";

async function CalendarSection({ conferenceDate }: { conferenceDate: Date }) {
   const conferences = await getAllCongressConferencesByDate(
      TEMP_CONSTANTS.CONGRESS_ID,
      date(conferenceDate),
   );

   // Fetch all recordings concurrently
   const recordingsPromises = conferences.map((conference) =>
      getConferenceRecordings(conference.id).then((recordings) => ({
         conferenceId: conference.id,
         recordings: recordings || [],
      })),
   );

   const recordingsResults = await Promise.all(recordingsPromises);

   // Convert results to the map format
   const conferenceRecordingsMap: Record<
      string,
      (ConferenceRecording & RecordModel)[]
   > = {};
   recordingsResults.forEach((result) => {
      conferenceRecordingsMap[result.conferenceId] = result.recordings;
   });

   return (
      <div className="flex flex-col gap-4">
         <ConferenceList
            conferences={
               conferences as (ConferenceWithSpeakerNamesAndPhones &
                  RecordModel)[]
            }
            conferenceRecordings={conferenceRecordingsMap}
            conferenceDate={conferenceDate}
         />
      </div>
   );
}

export default CalendarSection;
