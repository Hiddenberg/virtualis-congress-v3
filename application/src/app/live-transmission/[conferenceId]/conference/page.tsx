import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";
import { getActiveQuestionPollForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import AdminScheduledPage from "@/features/livestreams/components/AdminScheduledPage";
import GuestScheduledPage from "@/features/livestreams/components/GuestScheduledPage";
import LivestreamTransmissionInterface from "@/features/livestreams/components/transmissionInterface/LivestreamTransmissionInterface";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function ConferenceLivestreamTransmissionPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div>
            <h1>Conferencia no encontrada</h1>
         </div>
      );
   }
   const requiresLivestream =
      conference.conferenceType === "livestream" ||
      conference.conferenceType === "in-person";
   if (!requiresLivestream) {
      return (
         <div>
            <h1>
               La conferencia {conference.title} no requiere transmisión en vivo
               ya que es {conference.conferenceType}
            </h1>
         </div>
      );
   }

   const livestreamSession = await getConferenceLivestreamSession(conferenceId);
   if (!livestreamSession) {
      return (
         <div>
            <h1>Sesión de transmisión no encontrada</h1>
         </div>
      );
   }

   const userid = await getLoggedInUserId();
   const user = await getUserById(userid ?? "");
   const userIsAdmin = user?.role === "admin" || user?.role === "super_admin";

   if (livestreamSession.status === "scheduled") {
      if (userIsAdmin) {
         return (
            <AdminScheduledPage
               livestreamSessionId={livestreamSession.id}
               isQnASession={false}
            />
         );
      }
      return (
         <GuestScheduledPage
            startTime={conference.startTime}
            title={conference.title}
            description={conference.shortDescription}
         />
      );
   }

   const qnaSession = await getConferenceQnASession(conferenceId);
   const conferencePresentation = await getConferencePresentation(conferenceId);

   const activeConferenceQuestionPoll =
      await getActiveQuestionPollForConference(conferenceId);

   return (
      <LivestreamTransmissionInterface
         conference={conference}
         livestreamSession={livestreamSession}
         qnaSession={qnaSession}
         conferenceId={conferenceId}
         user={user}
         userIsAdmin={userIsAdmin}
         conferencePresentation={conferencePresentation}
         activeQuestionPollId={activeConferenceQuestionPoll?.id ?? null}
         isQna={false}
      />
   );
}
