import { CreditCard } from "lucide-react";
import type { CongressProductWithPrices } from "@/features/congresses/types/congressProductsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";

interface ImportantNotesProps {
   congress: CongressRecord;
   onlineAccessProduct?: CongressProductWithPrices;
   inPersonAccessProduct?: CongressProductWithPrices;
   recordingsProduct?: CongressProductWithPrices;
}

export default function ImportantNotes({
   congress,
   onlineAccessProduct,
   inPersonAccessProduct,
   recordingsProduct,
}: ImportantNotesProps) {
   return (
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 mb-12 p-6 border border-blue-100 rounded-2xl">
         <h4 className="flex items-center gap-2 mb-3 font-bold text-gray-900">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Información Importante
         </h4>
         <div className="gap-4 grid md:grid-cols-2 text-gray-700 text-sm">
            <div className="space-y-2">
               {onlineAccessProduct && (
                  <p>
                     <strong>Acceso Online:</strong> Transmisión en vivo de todas las conferencias con acceso desde cualquier
                     dispositivo.
                  </p>
               )}
               {congress.modality === "hybrid" && inPersonAccessProduct && (
                  <p>
                     <strong>Acceso Presencial:</strong> Incluye acceso completo al evento, coffee breaks y material del congreso.
                  </p>
               )}
            </div>
            <div className="space-y-2">
               {recordingsProduct && (
                  <p>
                     <strong>Grabaciones:</strong> Acceso por 3 meses posteriores al evento para revisión y estudio.
                  </p>
               )}
               {congress.modality === "hybrid" && (
                  <p>
                     <strong>Modalidad Híbrida:</strong> Puedes asistir presencialmente o seguir el evento en línea desde
                     cualquier lugar.
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}
