"use client";

import { ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { toggleArchiveProductPriceAction } from "../../serverActions/congressProductPricesActions";
import { ProductPriceRecord } from "../../types/congressProductPricesTypes";

export default function ToggleArchiveProductPriceButton({ productPrice }: { productPrice: ProductPriceRecord }) {
   const [isPending, startTransition] = useTransition();
   const isArchived = productPrice.archived;

   const confirmationMessage = isArchived
      ? "¿Estás seguro de querer desarchivar este precio? Este precio estará disponible para los usuarios nuevamente."
      : "¿Estás seguro de querer archivar este precio? Este precio dejará de estar disponible para los usuarios.";

   const successMessage = isArchived
      ? "Precio del producto desarchivado correctamente"
      : "Precio del producto archivado correctamente";

   const handleToggleArchivedStatus = () => {
      const confirmed = window.confirm(confirmationMessage);
      if (!confirmed) return;

      startTransition(async () => {
         const result = await toggleArchiveProductPriceAction(productPrice.id);
         if (!result.success) {
            toast.error(result.errorMessage);
            return;
         }

         toast.success(successMessage);
      });
   };
   return (
      <Button
         className="text-xs"
         variant={isArchived ? "green" : "destructive"}
         onClick={handleToggleArchivedStatus}
         loading={isPending}
      >
         {isArchived ? <ArchiveRestoreIcon className="size-4" /> : <ArchiveIcon className="size-4" />}
         {isArchived ? "Desarchivar" : "Archivar"}
      </Button>
   );
}
