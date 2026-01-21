"use client";

import { CalendarDays, ChartBar, EllipsisIcon, MessageSquareText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ConferenceTitleSection from "@/components/conference-zone/attendantComponents/ConferenceTitleSection";
import ChatComponent from "@/features/chats/components/ChatComponent";
import SelfContainedPresentationShower from "@/features/pptPresentations/components/SelfContainedPresentationShower";
import SelfContainedRaltimeQuestionPollWidget from "@/features/questionPolls/components/realtime/SelfContainedRaltimeQuestionPollWidget";
import SmartConferenceVideoPlayerSelector from "./SmartConferenceVideoSection";

interface AttendantConferenceViewerProps {
   conferencePresentationId: PresentationRecord | null;
   conference: CongressConferenceRecord;
   conferenceQuestionPollId: ConferenceQuestionPollRecord["id"] | null;
   serverTime: string;
   conferenceLivestreamSession: LivestreamSessionRecord | null;
   isQna?: boolean;
   conferenceRecording: SimpleRecordingRecord | null;
   speakerPresentationRecording: SimpleRecordingRecord | null;
}

export default function AttendantConferenceViewer({
   conferencePresentationId,
   conference,
   conferenceQuestionPollId,
   serverTime,
   conferenceLivestreamSession,
   isQna,
   conferenceRecording,
   speakerPresentationRecording,
}: AttendantConferenceViewerProps) {
   const [activeOverlay, setActiveOverlay] = useState<null | "chat" | "polls" | "program" | "options">(null);
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   // Disable background scroll when an overlay is open
   useEffect(() => {
      if (!activeOverlay) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = previousOverflow;
      };
   }, [activeOverlay]);

   const router = useRouter();

   const featureButtons = useMemo(
      () => [
         {
            key: "chat" as const,
            label: "Enviar mensaje",
            icon: MessageSquareText,
            onClick: () => setActiveOverlay("chat"),
         },
         {
            key: "polls" as const,
            label: "Encuestas",
            icon: ChartBar,
            onClick: () => setActiveOverlay("polls"),
         },
         {
            key: "program" as const,
            label: "Volver al programa",
            icon: CalendarDays,
            onClick: () => router.push(`/lobby`),
         },
         // {
         //    key: "options" as const,
         //    label: "Más opciones",
         //    icon: Ellipsis,
         //    onClick: () => setActiveOverlay("options")
         // }
      ],
      [router],
   );

   return (
      <div className="space-y-4 px-2 sm:px-4 py-4">
         {/* Feature buttons */}
         <div className="flex flex-wrap justify-center gap-2">
            {featureButtons.map(({ key, label, icon: Icon, onClick }) => (
               <button
                  key={key}
                  onClick={onClick}
                  className="bg-blue-50 hover:bg-blue-100 px-3 py-2 border border-blue-200 rounded-xl font-medium text-blue-700 text-sm transition-colors"
               >
                  <span className="inline-flex items-center gap-2">
                     <Icon className="w-4 h-4" />
                     {label}
                  </span>
               </button>
            ))}
         </div>

         {/* Main video / presentation */}
         <div className="relative rounded-2xl w-full overflow-hidden">
            {/* The player stays always running underneath */}
            <div className="w-full">
               <SmartConferenceVideoPlayerSelector
                  conference={conference}
                  isQna={isQna}
                  conferenceLivestreamSession={conferenceLivestreamSession}
                  conferencePresentationId={conferencePresentationId}
                  serverTime={serverTime}
                  conferenceRecording={conferenceRecording}
                  speakerPresentationRecording={speakerPresentationRecording}
               />
            </div>
         </div>

         {/* Full-screen overlay rendered in a portal */}
         {activeOverlay &&
            isMounted &&
            createPortal(
               <div className="z-50 fixed inset-0 bg-black/50 backdrop-blur-[2px]">
                  <div className="md:top-6 md:right-6 md:bottom-6 md:absolute md:w-[380px]">
                     <div className="bg-white md:shadow-2xl p-3 md:p-4 md:rounded-2xl rounded-t-2xl h-[100dvh] md:h-full overflow-auto md:overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-2">
                              {activeOverlay === "chat" && <MessageSquareText className="w-4 h-4 text-gray-700" />}
                              {activeOverlay === "polls" && <ChartBar className="w-4 h-4 text-gray-700" />}
                              {activeOverlay === "program" && <CalendarDays className="w-4 h-4 text-gray-700" />}
                              {activeOverlay === "options" && <EllipsisIcon className="w-4 h-4 text-gray-700" />}
                              <span className="font-semibold text-gray-800 text-sm">
                                 {activeOverlay === "chat" && "Chat"}
                                 {activeOverlay === "polls" && "Encuestas"}
                                 {activeOverlay === "program" && "Programa"}
                                 {activeOverlay === "options" && "Más opciones"}
                              </span>
                           </div>
                           <button
                              className="hover:bg-gray-100 p-1.5 rounded-md text-gray-500"
                              onClick={() => setActiveOverlay(null)}
                              aria-label="Cerrar panel"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="gap-3 grid">
                           {activeOverlay === "chat" && (
                              <div className="text-gray-600 text-sm">
                                 <ChatComponent />
                              </div>
                           )}
                           {activeOverlay === "polls" &&
                              (conferenceQuestionPollId ? (
                                 <SelfContainedRaltimeQuestionPollWidget conferenceId={conference.id} />
                              ) : (
                                 <div className="text-gray-600 text-sm">No hay encuestas asignadas a esta conferencia.</div>
                              ))}
                           {activeOverlay === "program" && (
                              <div className="text-gray-600 text-sm">Aquí se mostrará el programa de la conferencia.</div>
                           )}
                           {activeOverlay === "options" && (
                              <div className="text-gray-600 text-sm">Opciones adicionales próximamente.</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>,
               document.body,
            )}

         <ConferenceTitleSection expandedConference={conference} isQna={isQna} conferenceId={conference.id} />

         {/* Interactive presentation section */}
         {conferencePresentationId && (
            <section className="bg-white shadow-sm border border-gray-200 rounded-2xl">
               <div className="px-4 py-3 border-gray-200 border-b">
                  <h3 className="font-semibold text-gray-800">Diapositiva interactiva</h3>
               </div>
               <div className="p-4">
                  <SelfContainedPresentationShower presentationId={conferencePresentationId?.id ?? ""} />
               </div>
            </section>
         )}
      </div>
   );
}
