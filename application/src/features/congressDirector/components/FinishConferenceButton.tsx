"use client";

import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { finishConferenceAction } from "@/features/congressDirector/serverActions/directorActions";

export default function FinishConferenceButton({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
      const confirmed = window.confirm(
         "¿Marcar esta conferencia como finalizada?",
      );
      if (!confirmed) return;

      startTransition(async () => {
         const result = await finishConferenceAction(conferenceId);
         if (!result.success) {
            alert(result.errorMessage ?? "No se pudo finalizar la conferencia");
            return;
         }
         alert("Conferencia finalizada correctamente");
      });
   };

   return (
      <Button
         onClick={handleClick}
         loading={isPending}
         variant="dark"
         className="text-sm"
      >
         {isPending ? "Finalizando..." : "Marcar como finalizada"}
      </Button>
   );
}
