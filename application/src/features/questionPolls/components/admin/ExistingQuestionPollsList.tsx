import "server-only";

import { getAllQuestionPollsForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import QuestionPollCard from "@/features/questionPolls/components/admin/QuestionPollCard";
import { getQuestionPollOptions } from "@/features/questionPolls/services/questionPollServices";

export default async function ExistingQuestionPollsList({ conferenceId }: { conferenceId: CongressConferenceRecord["id"] }) {
   const questionPolls = await getAllQuestionPollsForConference(conferenceId);

   if (questionPolls.length === 0) {
      return (
         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <h2 className="mb-2 font-semibold text-gray-900 text-lg">Encuestas existentes</h2>
            <p className="text-gray-600">No hay encuestas creadas aún.</p>
         </div>
      );
   }

   const pollsWithOptions = await Promise.all(
      questionPolls.map(async (poll) => {
         const options = await getQuestionPollOptions(poll.id);
         return {
            poll,
            options,
         };
      }),
   );

   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
         <h2 className="mb-4 font-semibold text-gray-900 text-lg">Encuestas existentes</h2>
         <div className="space-y-4">
            {pollsWithOptions.map(({ poll, options }) => (
               <QuestionPollCard key={poll.id} poll={poll} options={options} conferenceId={conferenceId} />
            ))}
         </div>
      </div>
   );
}
