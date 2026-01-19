import AttendantConferenceViewer from "@/features/conferences/components/AttendantConferenceViewer";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";
import { getActiveQuestionPollForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getConferenceRecording } from "@/features/conferences/services/conferenceRecordingsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";

export default async function AttendantConferenceQnAPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const [conference, conferenceQuestionPoll, conferencePresentation] =
      await Promise.all([
         getConferenceById(conferenceId),
         getActiveQuestionPollForConference(conferenceId),
         getConferencePresentation(conferenceId),
      ]);
   const conferenceRecording = await getConferenceRecording(conferenceId);
   const conferenceQnaLivestreamSession =
      await getConferenceQnASession(conferenceId);

   return (
      <AttendantConferenceViewer
         conferencePresentationId={conferencePresentation}
         conference={conference!}
         conferenceRecording={conferenceRecording}
         conferenceQuestionPollId={conferenceQuestionPoll?.id ?? null}
         serverTime={new Date().toISOString()}
         conferenceLivestreamSession={conferenceQnaLivestreamSession}
         isQna={true}
         speakerPresentationRecording={null}
      />
   );
}
