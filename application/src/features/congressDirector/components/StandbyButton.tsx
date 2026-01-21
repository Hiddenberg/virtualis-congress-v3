"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { setStandbyStatusAction } from "@/features/congressDirector/serverActions/directorActions";

export default function StandbyButton({ isInitiallyStandby }: { isInitiallyStandby: boolean }) {
   const [isPending, startTransition] = useTransition();
   const [isStandby, setIsStandby] = useState<boolean | null>(isInitiallyStandby);

   useEffect(() => {
      // Hydrate current standby status
      // We cannot call server in client directly; rely on reflected UI via SSR or pass as prop in future.
      // For now, keep it null (unknown) and just show label toggle based on optimistic state after click.
   }, []);

   const handleClick = () => {
      const nextEnable = !isStandby;
      const confirmed = window.confirm(nextEnable ? "¿Poner el sistema en standby?" : "¿Quitar standby y activar el sistema?");
      if (!confirmed) return;

      startTransition(async () => {
         const result = await setStandbyStatusAction(nextEnable);
         if (!result.success) {
            alert(result.errorMessage ?? "No se pudo cambiar el estado de standby");
            return;
         }
         setIsStandby(nextEnable);
         alert(nextEnable ? "El congreso está en standby" : "Standby desactivado");
      });
   };

   return (
      <Button onClick={handleClick} loading={isPending} variant="amber" className="px-3 py-1.5 text-xs" title="Poner en standby">
         {isPending ? "Aplicando..." : isStandby ? "Quitar standby" : "Standby"}
      </Button>
   );
}
