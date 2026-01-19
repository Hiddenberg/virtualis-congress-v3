"use client";

import { RealtimeQuestionPollContextProvider } from "../../contexts/RealtimeQuestionPollContext";
import { useConferenceActiveQuestionPollRealtime } from "../../customHooks/useConferenceActiveQuestionPollRealtime";
import RealtimeQuestionPollCompactDisplay from "./RealtimeQuestionPollCompactDisplay";

export default function SelfContainedRealtimeQuestionPollCompactDisplay({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const { data, isLoading } =
      useConferenceActiveQuestionPollRealtime(conferenceId);

   if (isLoading) {
      return (
         <div className="bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl">
            <div className="flex items-center gap-3">
               <div className="border-2 border-t-transparent border-blue-500 rounded-full w-5 h-5 animate-spin" />
               <span className="font-medium text-slate-600">
                  Cargando encuesta...
               </span>
            </div>
         </div>
      );
   }

   if (!data)
      return (
         <div className="bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl">
            <div className="flex justify-center items-center py-2">
               <span className="font-medium text-slate-500 text-sm">
                  No hay encuesta activa para mostrar
               </span>
            </div>
         </div>
      );

   return (
      <RealtimeQuestionPollContextProvider
         key={data.questionPoll.id}
         initialQuestionPoll={data.questionPoll}
         initialQuestionPollOptions={data.questionPollOptions}
         initialQuestionPollAnswers={data.questionPollAnswers}
      >
         <RealtimeQuestionPollCompactDisplay />
      </RealtimeQuestionPollContextProvider>
   );
}
