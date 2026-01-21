import { redirect } from "next/navigation";
import { RealtimeLivestreamStatusProvider } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import CameraAndPresentationRecorderInterface from "@/features/simpleRecordings/components/recorderInterfaces/CameraAndPresentationRecorderInterface";
import CameraOnlyRecorderInterface from "@/features/simpleRecordings/components/recorderInterfaces/CameraOnlyRecorderInterface";
import { getRecordingLivestreamSessionByRecordingId } from "@/features/simpleRecordings/services/recordingLivestreamServices";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export const dynamic = "force-dynamic";

export default async function RecordingPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);
   const livestreamSession = await getRecordingLivestreamSessionByRecordingId(recordingId);

   if (!recording) {
      return (
         <div>
            <h1>No se encontró la grabación</h1>
         </div>
      );
   }

   if (recording.status === "reviewing") {
      return redirect(`/recordings/record/${recordingId}/review`);
   }

   if (recording.status === "ready") {
      return redirect(`/recordings/record/${recordingId}/recording-saved`);
   }

   if (!livestreamSession) {
      return (
         <div>
            <h1>No se encontró la sesión de grabación</h1>
         </div>
      );
   }

   const recordingPresentation = await getRecordingPresentationByRecordingId(recordingId);
   const recordingPresentationSlides = await getPresentationSlidesById(recordingPresentation?.id ?? "");

   return (
      <div>
         <ZoomSessionProvider sessionName={recording.title} sessionKey={recording.id}>
            <RealtimeLivestreamStatusProvider livestreamSession={livestreamSession}>
               {recording.recordingType === "only_camera" && <CameraOnlyRecorderInterface sessionTitle={recording.title} />}

               {recording.recordingType === "camera_and_presentation" && (
                  <CameraAndPresentationRecorderInterface
                     sessionTitle={recording.title}
                     initialPresentation={recordingPresentation}
                     initialPresentationSlides={recordingPresentationSlides}
                     recordingId={recordingId}
                  />
               )}
            </RealtimeLivestreamStatusProvider>
         </ZoomSessionProvider>
      </div>
   );
}
