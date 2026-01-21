"use client";

import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteRecordingPresentationAction } from "../serverActions/recordingPresentationsActions";

export default function DeleteRecordingPresentationButton({ recordingId }: { recordingId: SimpleRecordingRecord["id"] }) {
   const [isDeleting, startTransition] = useTransition();

   const handleDelete = () => {
      startTransition(async () => {
         const deleteRecordingPresentationResponse = await deleteRecordingPresentationAction({
            recordingId,
         });

         if (!deleteRecordingPresentationResponse.success) {
            toast.error(deleteRecordingPresentationResponse.errorMessage);
            return;
         }

         toast.success("Presentación eliminada correctamente");
         window.location.reload();
      });
   };

   return (
      <Button onClick={handleDelete} loading={isDeleting} variant="destructive" className="min-w-[140px]">
         <TrashIcon className="size-4" />
         {isDeleting ? "Eliminando..." : "Eliminar presentación"}
      </Button>
   );
}
