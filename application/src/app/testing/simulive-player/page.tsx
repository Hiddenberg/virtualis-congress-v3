import { addSecond } from "@formkit/tempo";
import { getConferenceRecordings } from "@/features/conferences/services/conferenceRecordingsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import SimuliveStagesWrapper from "@/features/simulive/components/SimuliveStagesWrapper";

export default async function SimulivePlayerPage() {
   const conference = await getConferenceById("");
   const conferenceRecording = await getConferenceRecordings("");

   const startDateTime = addSecond(new Date(), 30).toISOString();
   const serverTime = new Date().toISOString();
   if (!conference) {
      return <div>Conference not found</div>;
   }

   return (
      <div>
         <h1>Simulive Player</h1>

         <SimuliveStagesWrapper
            conference={conference}
            conferenceRecording={conferenceRecording[0]}
            isQna={false}
            simuliveData={{
               startDateTime,
               serverTime,
               durationSeconds: 48,
               speakerPresentationRecording: null,
            }}
         />
      </div>
   );
}
