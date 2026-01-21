"use client";

import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { deleteRecordingAction } from "../serverActions/recordingsActions";

export default function DeleteRecordingButton({ recordingId }: { recordingId: string }) {
   const [isDeleting, startTransition] = useTransition();

   const handleDelete = () => {
      // Show confirmation dialog
      const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta grabación? Esta acción no se puede deshacer.");

      if (!confirmed) return;

      startTransition(async () => {
         const deleteRecordingResponse = await deleteRecordingAction(recordingId);

         if (!deleteRecordingResponse.success) {
            alert(deleteRecordingResponse.errorMessage);
            return;
         }

         alert("Grabación eliminada correctamente");
      });
   };

   return (
      <Button onClick={handleDelete} loading={isDeleting} variant="destructive" className="w-full text-sm">
         <TrashIcon className="size-4" />
         {isDeleting ? "Eliminando..." : "Eliminar grabación"}
      </Button>
   );
}
