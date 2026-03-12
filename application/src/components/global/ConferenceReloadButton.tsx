"use client";

import { RefreshCw } from "lucide-react";

export default function ConferenceReloadButton() {
   return (
      <div className="flex flex-col items-center gap-1.5">
         <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 px-3 py-2 border border-yellow-200 rounded-xl font-medium text-yellow-700 text-sm transition-colors"
         >
            <RefreshCw className="w-4 h-4" />
            Recargar
         </button>
         <p className="max-w-[160px] text-gray-500 text-xs text-center">
            Si tienes problemas con la conferencia, puedes recargar la página con el botón de arriba.
         </p>
      </div>
   );
}
