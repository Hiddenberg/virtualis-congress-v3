"use client";

import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { startConferenceAction } from "@/features/congressDirector/serverActions/directorActions";

export default function StartConferenceButton({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
      const confirmed = window.confirm(
         "¿Iniciar esta conferencia ahora? Esto finalizará cualquier conferencia activa.",
      );
      if (!confirmed) return;

      startTransition(async () => {
         const result = await startConferenceAction(conferenceId);
         if (!result.success) {
            alert(result.errorMessage ?? "No se pudo iniciar la conferencia");
            return;
         }
         alert("Conferencia iniciada correctamente");
      });
   };

   return (
      <Button
         onClick={handleClick}
         loading={isPending}
         variant="green"
         className="text-sm"
      >
         {isPending ? "Iniciando..." : "Marcar como iniciada"}
      </Button>
   );
}
