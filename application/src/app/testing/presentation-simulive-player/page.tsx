import { addSecond } from "@formkit/tempo";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";
import SimuliveStagesWrapper from "@/features/simulive/components/SimuliveStagesWrapper";
import { getMuxAssetDuration } from "@/services/muxServices";

export default async function PresentationSimulivePlayerPage() {
   const simpleRecording = await getSimpleRecordingById("ob85ml6lg7l1u37");

   const recordingPresentation = await getRecordingPresentationByRecordingId(
      simpleRecording?.id ?? "",
   );
   const presentationRecording = await getPresentationRecordingByPresentationId(
      recordingPresentation?.id ?? "",
   );
   const conference = await getConferenceById("");
   const durationSeconds = await getMuxAssetDuration(
      simpleRecording?.muxAssetId ?? "",
   );

   if (!conference) {
      return <div>Conference not found</div>;
   }

   const startDate = addSecond(new Date(), 20).toISOString();
   const serverTime = new Date().toISOString();

   if (!presentationRecording) {
      return <div>Presentation recording not found</div>;
   }

   return (
      <div>
         <h1>Presentation Simulive Player</h1>

         <SimuliveStagesWrapper
            conference={conference}
            conferenceRecording={simpleRecording}
            isQna={false}
            simuliveData={{
               startDateTime: startDate,
               serverTime: serverTime,
               durationSeconds: durationSeconds ?? 0,
               speakerPresentationRecording: null,
            }}
         />
      </div>
   );
}
