"use client";

import { MessageSquareIcon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { enableConferenceQnAAction } from "@/features/conferences/actions/conferenceQnAActions";

export default function AdminQnASetup({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const [isEnabling, startTransition] = useTransition();

   const handleEnable = () => {
      startTransition(async () => {
         const res = await enableConferenceQnAAction({
            conferenceId,
         });
         if (!res.success) {
            toast.error(res.errorMessage);
            return;
         }
         toast.success("Sesión de QnA creada");
      });
   };

   return (
      <div className="bg-white shadow-sm p-5 border border-stone-200 rounded-xl max-w-2xl">
         <div className="flex items-start gap-3 mb-3">
            <div className="bg-stone-100 p-2 rounded-lg">
               <MessageSquareIcon className="w-5 h-5 text-stone-700" />
            </div>
            <div>
               <h2 className="font-semibold text-stone-900 text-base">
                  ¿Deseas habilitar QnA?
               </h2>
               <p className="text-stone-600 text-sm">
                  Crea una sesión de preguntas y respuestas para esta
                  conferencia.
               </p>
            </div>
         </div>
         <div className="flex gap-3">
            <button
               disabled={isEnabling}
               onClick={handleEnable}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 px-4 py-2 rounded-md text-white text-sm"
            >
               {isEnabling ? "Creando..." : "Crear sesión de QnA"}
            </button>
         </div>
      </div>
   );
}
