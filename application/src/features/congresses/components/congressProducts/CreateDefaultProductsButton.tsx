"use client";

import { Loader2, PlusIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { createDefaultCongressProductsAction } from "../../serverActions/congressProductsActions";

export default function CreateDefaultProductsButton() {
   const [isLoading, startTransition] = useTransition();
   const handleCreateDefaultProducts = () => {
      startTransition(async () => {
         const result = await createDefaultCongressProductsAction();

         if (!result.success) {
            toast.error(result.errorMessage);
            return;
         }

         toast.success("Productos por defecto creados correctamente");
      });
   };

   return (
      <Button loading={isLoading} onClick={handleCreateDefaultProducts}>
         {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
         {isLoading ? "Creando..." : "Crear productos por defecto"}
      </Button>
   );
}
