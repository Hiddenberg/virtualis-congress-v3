"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteQuestionPollAction } from "@/features/questionPolls/serverActions/questionPollActions";

export default function DeleteQuestionPollButton({
   conferenceId,
   pollId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   pollId: QuestionPollRecord["id"];
}) {
   const [isPending, startTransition] = useTransition();

   const handleDelete = () => {
      if (
         !confirm("¿Eliminar esta encuesta? Esta acción no se puede deshacer.")
      )
         return;

      startTransition(async () => {
         await deleteQuestionPollAction({
            conferenceId,
            pollId,
         });
      });
   };

   return (
      <button
         type="button"
         onClick={handleDelete}
         className="inline-flex justify-center items-center hover:bg-gray-50 disabled:opacity-50 border border-gray-300 rounded-md w-8 h-8 text-gray-700"
         disabled={isPending}
         aria-label="Eliminar encuesta"
      >
         <Trash2 className="w-4 h-4" />
      </button>
   );
}
