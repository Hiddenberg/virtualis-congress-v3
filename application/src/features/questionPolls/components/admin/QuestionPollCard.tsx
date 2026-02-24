import { CheckCircle, CircleDot, CircleSlash } from "lucide-react";
import type { CongressConferenceRecord } from "@/features/conferences/types/conferenceTypes";
import DeleteQuestionPollButton from "@/features/questionPolls/components/admin/actions/DeleteQuestionPollButton";

export default function QuestionPollCard({
   poll,
   options,
   conferenceId,
}: {
   poll: QuestionPollRecord;
   options: QuestionPollOptionRecord[];
   conferenceId: CongressConferenceRecord["id"];
}) {
   const isActive = poll.status === "active";

   return (
      <div className="p-4 border border-gray-200 rounded-lg">
         <div className="flex justify-between items-start gap-4">
            <div>
               <h3 className="font-medium text-gray-900">{poll.question}</h3>
               <div className="space-y-2 mt-3">
                  {options.map((opt) => (
                     <div key={opt.id} className="flex items-center gap-2 text-gray-700">
                        <CircleDot className="w-4 h-4 text-gray-400" />
                        <span>{opt.text}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
               {isActive ? (
                  <span className="inline-flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full font-medium text-green-700 text-xs">
                     <CheckCircle className="w-4 h-4" /> Activa
                  </span>
               ) : (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full font-medium text-gray-700 text-xs">
                     <CircleSlash className="w-4 h-4" /> Finalizada
                  </span>
               )}
               <DeleteQuestionPollButton conferenceId={conferenceId} pollId={poll.id} />
            </div>
         </div>
      </div>
   );
}
