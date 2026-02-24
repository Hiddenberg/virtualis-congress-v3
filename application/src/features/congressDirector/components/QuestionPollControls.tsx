"use client";

import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import type { CongressConferenceRecord } from "@/features/conferences/types/conferenceTypes";
import { setQuestionPollStatusAction } from "@/features/congressDirector/serverActions/directorActions";

export default function QuestionPollControls({
   conferenceId,
   poll,
}: {
   conferenceId: CongressConferenceRecord["id"];
   poll: QuestionPollRecord;
}) {
   const [isPending, startTransition] = useTransition();

   const handleSetStatus = (status: QuestionPoll["status"]) => {
      const messages: Record<QuestionPoll["status"], string> = {
         active: "¿Activar esta encuesta?",
         inactive: "¿Desactivar esta encuesta?",
         finished: "¿Finalizar esta encuesta? Ya no aceptará más respuestas.",
      };
      const confirmed = window.confirm(messages[status]);
      if (!confirmed) return;

      startTransition(async () => {
         const res = await setQuestionPollStatusAction(conferenceId, poll.id, status);
         if (!res.success) {
            alert(res.errorMessage ?? "No se pudo actualizar la encuesta");
            return;
         }
         alert("Encuesta actualizada correctamente");
      });
   };

   return (
      <div className="flex flex-wrap items-center gap-2">
         <Button
            onClick={() => handleSetStatus("active")}
            loading={isPending}
            variant="green"
            className="text-xs"
            disabled={poll.status === "active"}
         >
            Activar
         </Button>
         <Button
            onClick={() => handleSetStatus("inactive")}
            loading={isPending}
            variant="secondary"
            className="text-xs"
            disabled={poll.status === "inactive"}
         >
            Desactivar
         </Button>
         <Button
            onClick={() => handleSetStatus("finished")}
            loading={isPending}
            variant="dark"
            className="text-xs"
            disabled={poll.status === "finished"}
         >
            Finalizar
         </Button>
      </div>
   );
}
