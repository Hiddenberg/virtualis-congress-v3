import RealtimeQuestionPollDisplay from "@/features/questionPolls/components/realtime/RealtimeQuestionPollDisplay";
import RealtimeQuestionPollWidget from "@/features/questionPolls/components/realtime/RealtimeQuestionPollWidget";
import { RealtimeQuestionPollContextProvider } from "@/features/questionPolls/contexts/RealtimeQuestionPollContext";
import {
   getAllQuestionPollAnswers,
   getQuestionPollById,
   getQuestionPollOptions,
} from "@/features/questionPolls/services/questionPollServices";

export default async function QuestionPollsPage() {
   const questionPoll = await getQuestionPollById("8napzu560wosqo3");
   const questionPollOptions = await getQuestionPollOptions(questionPoll?.id ?? "");
   const questionPollAnswers = await getAllQuestionPollAnswers(questionPoll?.id ?? "");

   if (!questionPoll) {
      return <div>Question poll not found</div>;
   }

   return (
      <div>
         <h1>Question Polls</h1>

         <RealtimeQuestionPollContextProvider
            initialQuestionPoll={questionPoll}
            initialQuestionPollOptions={questionPollOptions}
            initialQuestionPollAnswers={questionPollAnswers}
         >
            <RealtimeQuestionPollWidget />
            <RealtimeQuestionPollDisplay />
         </RealtimeQuestionPollContextProvider>
      </div>
   );
}
