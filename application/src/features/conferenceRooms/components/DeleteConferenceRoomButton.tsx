"use client";

import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteConferenceRoomAction } from "../actions/conferenceRoomsActions";

export default function DeleteConferenceRoomButton({ conferenceRoomId }: { conferenceRoomId: string }) {
   const [isDeleting, startTransition] = useTransition();

   const handleDelete = () => {
      const confirmed = window.confirm("¿Estás seguro de querer eliminar esta sala? Esta acción no se puede deshacer.");
      if (!confirmed) return;

      startTransition(async () => {
         const deleteResponse = await deleteConferenceRoomAction(conferenceRoomId);

         if (!deleteResponse.success) {
            toast.error(deleteResponse.errorMessage);
            return;
         }

         toast.success("Sala eliminada correctamente");
      });
   };

   return (
      <Button
         variant="none"
         onClick={handleDelete}
         disabled={isDeleting}
         loading={isDeleting}
         className="rounded-full p-2 text-red-500 hover:bg-red-500/10"
      >
         <Trash2Icon className="size-4" />
      </Button>
   );
}
