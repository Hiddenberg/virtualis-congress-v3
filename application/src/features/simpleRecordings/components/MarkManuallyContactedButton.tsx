"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { updateRecordingAction } from "../serverActions/recordingsActions";

interface MarkManuallyContactedButtonProps {
   recordingId: string;
}

export default function MarkManuallyContactedButton({ recordingId }: MarkManuallyContactedButtonProps) {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   return (
      <Button
         variant="white"
         className="hover:bg-blue-100/80 border border-blue-200 text-blue-700 text-sm"
         loading={isPending}
         onClick={() =>
            startTransition(async () => {
               const response = await updateRecordingAction(recordingId, { manuallyContacted: true });

               if (!response.success) {
                  alert(response.errorMessage ?? "Error al marcar como contactado");
               } else {
                  router.refresh();
               }
            })
         }
      >
         {isPending ? "Marcando..." : "Marcar como contactado manualmente"}
      </Button>
   );
}
