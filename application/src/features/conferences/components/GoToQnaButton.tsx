"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRealtimeLivestreamStatusContext } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider";

export default function GoToQnaButton({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const { livestreamStatus } = useRealtimeLivestreamStatusContext();

   const searchParams = useSearchParams();
   const isHost =
      searchParams.get("ishost") === "true" ||
      searchParams.get("isHost") === "true";

   if (livestreamStatus !== "ended") {
      return null;
   }

   return (
      <a
         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
         href={`/live-transmission/${conferenceId}/qna${isHost ? "?ishost=true" : ""}`}
      >
         <MessageCircleQuestionIcon className="size-4" />
         Ir a la sessión de preguntas y respuestas
      </a>
   );
}
