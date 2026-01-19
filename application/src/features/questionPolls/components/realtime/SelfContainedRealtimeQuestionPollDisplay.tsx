"use client";

import { RealtimeQuestionPollContextProvider } from "../../contexts/RealtimeQuestionPollContext";
import { useConferenceActiveQuestionPollRealtime } from "../../customHooks/useConferenceActiveQuestionPollRealtime";
import RealtimeQuestionPollDisplay from "./RealtimeQuestionPollDisplay";

export default function SelfContainedRealtimeQuestionPollDisplay({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const { data, isLoading } =
      useConferenceActiveQuestionPollRealtime(conferenceId);

   if (isLoading) {
      return <div>Cargando encuesta...</div>;
   }

   if (!data) return <div>No hay encuesta activa para mostrar</div>;

   return (
      <RealtimeQuestionPollContextProvider
         key={data.questionPoll.id}
         initialQuestionPoll={data.questionPoll}
         initialQuestionPollOptions={data.questionPollOptions}
         initialQuestionPollAnswers={data.questionPollAnswers}
      >
         <RealtimeQuestionPollDisplay />
      </RealtimeQuestionPollContextProvider>
   );
}
