import AttendantConferenceViewer from "@/features/conferences/components/AttendantConferenceViewer";
import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getActiveQuestionPollForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getConferenceRecording } from "@/features/conferences/services/conferenceRecordingsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerPresentationRecordingByConferenceId } from "@/features/conferences/services/conferenceSpeakerPresentationRecordingServices";

export default async function AttendantConferencePage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const [
      conference,
      conferenceQuestionPoll,
      conferencePresentation,
      conferenceLivestreamSession,
      conferenceRecording,
      speakerPresentationRecording,
   ] = await Promise.all([
      getConferenceById(conferenceId),
      getActiveQuestionPollForConference(conferenceId),
      getConferencePresentation(conferenceId),
      getConferenceLivestreamSession(conferenceId),
      getConferenceRecording(conferenceId),
      getSpeakerPresentationRecordingByConferenceId(conferenceId),
   ]);

   if (!conference) {
      return (
         <div className="flex flex-col justify-center items-center space-y-4 h-80">
            <h1 className="font-bold text-2xl">
               No se encontró esta conferencia
            </h1>
         </div>
      );
   }

   return (
      <AttendantConferenceViewer
         conferencePresentationId={conferencePresentation}
         conference={conference}
         conferenceQuestionPollId={conferenceQuestionPoll?.id ?? null}
         serverTime={new Date().toISOString()}
         conferenceLivestreamSession={conferenceLivestreamSession}
         conferenceRecording={conferenceRecording}
         speakerPresentationRecording={speakerPresentationRecording}
      />
   );
}
