"use client";

import { X } from "lucide-react";
import { Button } from "@/components/global/Buttons";

export default function CloseTabButton({ className }: { className?: string }) {
   const handleClose = () => {
      try {
         window.open("", "_self");
         window.close();
      } catch {
         // no-op; browsers may block programmatic close
      }
   };

   return (
      <div className={className}>
         <Button onClick={handleClose} variant="blue" className="inline-flex items-center gap-2">
            <X className="w-4 h-4" />
            <span>Cerrar pestaña</span>
         </Button>
         <p className="mt-2 text-gray-500 text-xs">Si no se cierra automáticamente, puedes cerrar esta pestaña manualmente.</p>
      </div>
   );
}
