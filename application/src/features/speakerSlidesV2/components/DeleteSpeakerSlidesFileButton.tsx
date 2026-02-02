"use client";

import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteSpeakerSlidesFileAction } from "../serverActions/speakerSlidesActions";

export default function DeleteSpeakerSlidesFileButton({ fileId }: { fileId: string }) {
   const [isDeleting, startTransition] = useTransition();

   const handleDelete = () => {
      const confirmation = window.confirm(
         "¿Estás seguro de querer eliminar este archivo?, El archivo se eliminará de la base de datos y de Google Drive.\nEsta acción no se puede deshacer.",
      );
      if (!confirmation) return;
      startTransition(async () => {
         const deleteResponse = await deleteSpeakerSlidesFileAction(fileId);
         if (!deleteResponse.success) {
            toast.error(deleteResponse.errorMessage || "Error al eliminar el archivo");
            return;
         }
         toast.success("Archivo eliminado correctamente");
         window.location.reload();
      });
   };
   return (
      <Button variant="destructive" onClick={handleDelete} loading={isDeleting} className="w-full text-sm">
         <TrashIcon className="size-4" />
         {isDeleting ? "Eliminando..." : "Eliminar archivo"}
      </Button>
   );
}
