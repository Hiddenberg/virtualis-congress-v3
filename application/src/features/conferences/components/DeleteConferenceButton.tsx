"use client";

import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteConferenceAction } from "../actions/conferenceActions";

export default function DeleteConferenceButton({ conferenceId }: { conferenceId: string }) {
   const [deleting, startTransition] = useTransition();

   const handleDelete = () => {
      const confirm = window.confirm("¿Estás seguro de querer eliminar esta conferencia? Esta acción no se puede deshacer.");
      if (!confirm) return;

      startTransition(async () => {
         const deleteResponse = await deleteConferenceAction(conferenceId);
         if (deleteResponse.success) {
            toast.success("Conferencia eliminada correctamente");
            return;
         }

         toast.error(deleteResponse.errorMessage);
      });
   };

   return (
      <Button
         variant="none"
         onClick={handleDelete}
         disabled={deleting}
         loading={deleting}
         className="hover:bg-red-500/10 p-2 rounded-full text-red-500"
      >
         <Trash2Icon className="size-4" />
      </Button>
   );
}
