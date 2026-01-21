import { CoffeeIcon, Home, MessageSquareOff } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import LivestreamStagesWrapper from "@/features/livestreams/components/userView/LivestreamStagesWrapper";
import { RealtimeLivestreamStatusProvider } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider";
import SimuliveStagesWrapper from "@/features/simulive/components/SimuliveStagesWrapper";

type ConferenceTransmissionType = "live" | "pre-recorded" | "break" | "unknown";
function getConferenceType(conference: CongressConferenceRecord): ConferenceTransmissionType {
   if (conference.conferenceType === "livestream" || conference.conferenceType === "in-person") {
      return "live";
   }

   if (conference.conferenceType === "simulated_livestream" || conference.conferenceType === "pre-recorded") {
      return "pre-recorded";
   }

   if (conference.conferenceType === "break") {
      return "break";
   }

   return "unknown";
}

export default function SmartConferenceVideoPlayerSelector({
   conference,
   isQna,
   conferenceLivestreamSession,
   conferencePresentationId,
   serverTime,
   conferenceRecording,
   speakerPresentationRecording,
}: {
   conference: CongressConferenceRecord;
   isQna?: boolean;
   conferenceLivestreamSession: LivestreamSessionRecord | null;
   conferencePresentationId: PresentationRecord | null;
   serverTime: string;
   conferenceRecording: SimpleRecordingRecord | null;
   speakerPresentationRecording: SimpleRecordingRecord | null;
}) {
   const conferenceTransmissionType = getConferenceType(conference);

   if (conferenceTransmissionType === "break") {
      <div className="flex justify-center items-center w-full h-full aspect-video">
         <CoffeeIcon className="w-10 h-10" />
         Cofee break
      </div>;
   }

   if (conferenceTransmissionType === "live" || isQna) {
      if (!conferenceLivestreamSession) {
         return (
            <div className="flex flex-col justify-center items-center bg-gray-50 mb-4 p-6 sm:p-8 border border-gray-200 rounded-lg aspect-video">
               <div className="flex flex-col justify-center items-center gap-4 text-center">
                  <div className="flex justify-center items-center bg-blue-100 p-4 rounded-full">
                     <MessageSquareOff className="size-8 text-blue-600" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <h2 className="font-semibold text-gray-900 text-xl sm:text-2xl">
                        {isQna ? "No hay sesión de preguntas y respuestas" : "No hay sesión de livestream disponible"}
                     </h2>
                     <p className="text-gray-600 text-base sm:text-lg">
                        {isQna
                           ? "Esta conferencia no incluye una sesión de preguntas y respuestas en este momento."
                           : "Esta conferencia no tiene una sesión de livestream disponible en este momento."}
                     </p>
                  </div>

                  <div className="mt-4">
                     <LinkButton
                        href="/lobby"
                        variant="blue"
                        className="flex justify-center items-center gap-2 px-6 py-3 text-base"
                     >
                        <Home className="size-5" />
                        Volver al lobby
                     </LinkButton>
                  </div>
               </div>
            </div>
         );
      }

      return (
         <RealtimeLivestreamStatusProvider livestreamSession={conferenceLivestreamSession}>
            <LivestreamStagesWrapper
               conference={conference}
               conferencePresentation={conferencePresentationId}
               serverTime={serverTime}
               isQna={isQna}
            />
         </RealtimeLivestreamStatusProvider>
      );
   }

   if (conferenceTransmissionType === "pre-recorded") {
      return (
         <SimuliveStagesWrapper
            conference={conference}
            conferenceRecording={conferenceRecording}
            simuliveData={{
               startDateTime: conference.startTime,
               serverTime,
               durationSeconds: conferenceRecording?.durationSeconds ?? 0,
               speakerPresentationRecording: speakerPresentationRecording ?? null,
            }}
            isQna={isQna}
         />
      );
   }

   // this section should not be reached
   return (
      <div>
         <h1>Smart Conference Video Section</h1>
         <p>This section should not be reached</p>
      </div>
   );
}
