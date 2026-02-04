import { BarChart3, EyeIcon, MessageCircleIcon, MessageCircleQuestionIcon, UsersIcon, VideoIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import ChatComponent from "@/features/chats/components/ChatComponent";
import GoToQnaButton from "@/features/conferences/components/GoToQnaButton";
import LivestreamPresentationRecorderWrapper from "@/features/pptPresentations/components/realtime/LivestreamPresentationRecorderWrapper";
import RealtimePresentationController from "@/features/pptPresentations/components/realtime/RealtimePresentationController";
import SelfContainedRealtimeQuestionPollDisplay from "@/features/questionPolls/components/realtime/SelfContainedRealtimeQuestionPollDisplay";
import type { UserRecord } from "@/features/users/types/userTypes";
import { RealtimeLivestreamStatusProvider } from "../../contexts/RealtimeLivestreamStatusProvider";
import { ZoomSessionProvider } from "../../contexts/ZoomSessionContext";
import CollapsibleGuestLink from "../CollapsibleGuestLink";
import DynamicZoomCallInterface from "../DynamicZoomCallInterface";
import { LivestreamControlButtons } from "../LivestreamControlButtons";

function GoToQnASessionSection({
   qnaSession,
   conferenceId,
}: {
   qnaSession: LivestreamSessionRecord | null;
   conferenceId: string;
}) {
   if (qnaSession) {
      return (
         <div className="flex justify-center mb-4 w-full">
            <GoToQnaButton conferenceId={conferenceId} />
         </div>
      );
   }

   return (
      <div className="flex justify-center mb-4 w-full">
         <p className="text-gray-500 text-sm">No hay sesión de preguntas y respuestas preparada para esta conferencia</p>
      </div>
   );
}

function LiveTransmissionHeader({ isQna, conference }: { isQna: boolean; conference: CongressConferenceRecord }) {
   return (
      <div
         className={`bg-linear-to-r! flex justify-between items-center shadow-lg mb-6 p-2 px-4 rounded-2xl ${isQna ? "from-green-600 to-green-700" : "from-blue-600 to-blue-700"}`}
      >
         <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isQna ? "bg-green-500" : "bg-blue-500"}`}>
               {isQna ? (
                  <MessageCircleQuestionIcon className="w-6 h-6 text-white" />
               ) : (
                  <VideoIcon className="w-6 h-6 text-white" />
               )}
            </div>
            <div>
               <p className="text-blue-100">
                  {isQna
                     ? "Sesión de preguntas y respuestas en vivo para la conferencia:"
                     : "Transmisión en vivo para la conferencia:"}
               </p>
               <h1 className="font-bold text-white text-2xl capitalize">{conference.title}</h1>
            </div>
         </div>
         <div className="flex flex-col gap-2 p-2 border-white! rounded-lg *:w-full border!">
            <div className="flex justify-center items-center gap-2">
               <EyeIcon className="w-6 h-6 text-white shrink-0" />
               <p className="font-semibold text-white text-sm">Ver como asistente</p>
            </div>
            <LinkButton target="_blank" href={`/live-transmission/${conference.id}/speaker-view/conference`} variant="white">
               Ver conferencia
            </LinkButton>

            {/* <LinkButton target="_blank" href={`/live-transmission/${conference.id}/speaker-view/QnA`} variant="white">
                  Ver sesión de preguntas
               </LinkButton> */}
         </div>
      </div>
   );
}

interface LivestreamTransmissionInterfaceProps {
   conference: CongressConferenceRecord;
   livestreamSession: LivestreamSessionRecord;
   qnaSession: LivestreamSessionRecord | null;
   conferenceId: string;
   user: UserRecord | null;
   userIsAdmin: boolean;
   conferencePresentation: PresentationRecord | null;
   activeQuestionPollId: string | null;
   isQna: boolean;
}
export default function LivestreamTransmissionInterface({
   conference,
   livestreamSession,
   qnaSession,
   conferenceId,
   user,
   userIsAdmin,
   conferencePresentation,
   activeQuestionPollId,
   isQna,
}: LivestreamTransmissionInterfaceProps) {
   return (
      <div className="bg-linear-to-br from-blue-50 to-white px-2 py-4 min-h-screen">
         <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <LiveTransmissionHeader isQna={isQna} conference={conference} />

            <ZoomSessionProvider sessionName={`${conference.title}-conf`} sessionKey={livestreamSession.id}>
               {/* Control Buttons Section */}
               <div className="bg-white shadow-lg mb-6 p-6 border border-gray-200 rounded-2xl">
                  <RealtimeLivestreamStatusProvider livestreamSession={livestreamSession}>
                     {!isQna && <GoToQnASessionSection qnaSession={qnaSession} conferenceId={conferenceId} />}
                     <LivestreamControlButtons sessionTitle={conference.title} livestreamSessionId={livestreamSession.id} />
                  </RealtimeLivestreamStatusProvider>
               </div>

               {/* Main Content Area */}
               <div className="gap-2 grid grid-cols-4">
                  {/* Video Section */}
                  <div className="col-span-3">
                     <div className="bg-white shadow-lg p-6 border border-gray-200 rounded-2xl">
                        {conferencePresentation && !conferencePresentation.hasVideo && (
                           <div className="flex items-center gap-3 mb-6">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                 <UsersIcon className="w-5 h-5 text-blue-700" />
                              </div>
                              <h2 className="font-semibold text-gray-900 text-xl">Sesión de video</h2>
                           </div>
                        )}
                        {conferencePresentation && !conferencePresentation.hasVideo ? (
                           <div>
                              <LivestreamPresentationRecorderWrapper
                                 presentationId={conferencePresentation.id}
                                 livestreamSession={livestreamSession}
                              >
                                 <RealtimePresentationController presentationId={conferencePresentation.id} />
                              </LivestreamPresentationRecorderWrapper>
                           </div>
                        ) : (
                           <div className="rounded-xl w-full overflow-hidden">
                              <DynamicZoomCallInterface initialUsername={user?.name} allowScreenShare />
                           </div>
                        )}
                     </div>
                     {/* Polls Section */}
                     {activeQuestionPollId && (
                        <div className="bg-white shadow-lg mt-4 p-6 border border-gray-200 rounded-2xl">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                 <BarChart3 className="w-5 h-5 text-blue-700" />
                              </div>
                              <h2 className="font-semibold text-gray-900 text-lg">Encuesta en vivo</h2>
                           </div>
                           <SelfContainedRealtimeQuestionPollDisplay conferenceId={conferenceId} />
                        </div>
                     )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                     {conferencePresentation && !conferencePresentation.hasVideo && (
                        <DynamicZoomCallInterface initialUsername={user?.name} />
                     )}
                     {/* Guest Link Section */}
                     {userIsAdmin && <CollapsibleGuestLink streamingRoute={`/live-transmission/${conferenceId}/conference`} />}

                     {/* Chat Section */}
                     <div className="bg-white shadow-lg p-6 border border-gray-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="bg-blue-50 p-2 rounded-lg">
                              <MessageCircleIcon className="w-5 h-5 text-blue-700" />
                           </div>
                           <h2 className="font-semibold text-gray-900 text-lg">Chat Público</h2>
                        </div>
                        <ChatComponent />
                     </div>
                  </div>
               </div>
            </ZoomSessionProvider>
         </div>
      </div>
   );
}
