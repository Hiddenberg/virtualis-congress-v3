import { AlertCircle } from "lucide-react";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";

interface ModalitySelectorProps {
   modality: "in-person" | "virtual" | "";
   setModality: (value: "in-person" | "virtual" | "") => void;
   isPaidSelected: boolean;
   congress: CongressRecord;
}

export function ModalitySelector({ modality, setModality, isPaidSelected, congress }: ModalitySelectorProps) {
   const modalityOptions =
      congress.modality === "online"
         ? [
              {
                 value: "virtual",
                 label: "Virtual",
                 icon: "💻",
              },
           ]
         : [
              {
                 value: "in-person",
                 label: "Presencial",
                 icon: "🏢",
              },
              {
                 value: "virtual",
                 label: "Virtual",
                 icon: "💻",
              },
           ];

   if (isPaidSelected) {
      return (
         <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">No se puede cambiar la modalidad de usuarios ya pagados</p>
         </div>
      );
   }

   return (
      <div>
         <div className="block mb-3 font-medium text-gray-700 text-sm">Modalidad de Asistencia</div>
         <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
            {modalityOptions.map((option) => (
               <button
                  key={option.value}
                  type="button"
                  onClick={() => setModality(option.value as "in-person" | "virtual" | "")}
                  disabled={isPaidSelected}
                  className={`
                     p-4 rounded-lg border-2 transition-all text-left
                     ${modality === option.value ? "border-blue-500 bg-blue-50 text-blue-900" : isPaidSelected ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                  `}
               >
                  <div className="mb-1 text-lg">{option.icon}</div>
                  <div className="font-medium text-sm">{option.label}</div>
               </button>
            ))}
         </div>
         {isPaidSelected && (
            <p className="flex items-center gap-1 mt-2 text-amber-600 text-xs">
               <AlertCircle size={12} />
               No se puede cambiar la modalidad de usuarios ya pagados
            </p>
         )}
      </div>
   );
}
