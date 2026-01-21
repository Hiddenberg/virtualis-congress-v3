"use client";

import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteOrganizationCredentialsAction } from "../serverActions/organizationCredentialsActions";

export default function DeleteOrganizationCredentialsButton({ credentialsId }: { credentialsId: string }) {
   const [isSubmitting, startTransition] = useTransition();

   const handleDelete = () => {
      startTransition(async () => {
         const response = await deleteOrganizationCredentialsAction(credentialsId);

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         toast.success("Credenciales eliminadas exitosamente");
      });
   };

   return (
      <Button
         title="Eliminar credenciales"
         variant="none"
         className="bg-red-500 hover:bg-red-600 text-white"
         onClick={handleDelete}
         disabled={isSubmitting}
      >
         <TrashIcon className="w-4 h-4" />
         {isSubmitting ? "Eliminando..." : "Eliminar credenciales"}
      </Button>
   );
}
