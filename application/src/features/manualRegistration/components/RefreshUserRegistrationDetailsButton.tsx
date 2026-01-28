"use client";

import { RefreshCwIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { refreshCongressUserRegistrationDetailsAction } from "../serverActions/manualRegistrationActions";

export function RefreshUserRegistrationDetailsButton() {
   const [refreshing, startTransition] = useTransition();

   const handleRefresh = () => {
      startTransition(async () => {
         const response = await refreshCongressUserRegistrationDetailsAction();
         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }
         toast.success("Lista de usuarios actualizada");
      });
   };

   return (
      <Button title="Actualizar lista de usuarios" onClick={handleRefresh} loading={refreshing} variant="blue" className="w-full">
         <RefreshCwIcon className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
      </Button>
   );
}
