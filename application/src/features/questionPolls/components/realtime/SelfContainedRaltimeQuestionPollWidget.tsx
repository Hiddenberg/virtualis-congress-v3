"use client";

import { RealtimeQuestionPollContextProvider } from "../../contexts/RealtimeQuestionPollContext";
import { useConferenceActiveQuestionPollRealtime } from "../../customHooks/useConferenceActiveQuestionPollRealtime";
import RealtimeQuestionPollWidget from "./RealtimeQuestionPollWidget";

export default function SelfContainedRaltimeQuestionPollWidget({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const { data: questionPollData, isLoading } =
      useConferenceActiveQuestionPollRealtime(conferenceId);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!questionPollData) return <div>No hay encuesta activa para mostrar</div>;

   return (
      <RealtimeQuestionPollContextProvider
         key={questionPollData.questionPoll.id}
         initialQuestionPoll={questionPollData.questionPoll}
         initialQuestionPollOptions={questionPollData.questionPollOptions}
         initialQuestionPollAnswers={questionPollData.questionPollAnswers}
      >
         <RealtimeQuestionPollWidget />
      </RealtimeQuestionPollContextProvider>
   );
}
