"use client";

import { AlertTriangle, TrashIcon } from "lucide-react";
import { Button } from "@/components/global/Buttons";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";
import type { SimpleRecordingRecord } from "../types/recordingsTypes";
import DeleteRecordingPresentationButton from "./DeleteRecordingPresentationButton";

function DeletePresentationPopup({ recordingId }: { recordingId: SimpleRecordingRecord["id"] }) {
   const { closePopUp } = useGlobalPopUpContext();

   return (
      <div className="flex flex-col items-center gap-6 mx-auto px-2 py-4 max-w-2xl">
         {/* Icon */}
         <div className="flex justify-center items-center bg-red-50 rounded-full w-16 h-16">
            <AlertTriangle className="w-8 h-8 text-red-500" />
         </div>

         {/* Title */}
         <h1 className="font-bold text-gray-900 text-2xl text-center">Usar otra diapositiva</h1>

         {/* Description */}
         <div className="space-y-3 text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
               Se eliminará la diapositiva actual para que puedas subir una nueva.
            </p>
            <p className="font-semibold text-gray-900">¿Estás seguro de que quieres eliminar la diapositiva actual?</p>
            <p className="text-gray-600 text-sm">Esta acción no se puede deshacer.</p>
         </div>

         {/* Buttons */}
         <div className="flex flex-wrap justify-center items-center gap-3 mt-2 w-full">
            <Button variant="secondary" onClick={closePopUp} className="min-w-[140px]">
               Cancelar
            </Button>
            <DeleteRecordingPresentationButton recordingId={recordingId} />
         </div>
      </div>
   );
}

export default function DeleteRecordingPresentationWPopupButton({ recordingId }: { recordingId: SimpleRecordingRecord["id"] }) {
   const { showInPopUp } = useGlobalPopUpContext();

   const handleClick = () => {
      showInPopUp(<DeletePresentationPopup recordingId={recordingId} />);
   };
   return (
      <div>
         <Button variant="destructive" onClick={handleClick}>
            <TrashIcon className="size-4" />
            Usar otra diapositiva
         </Button>
      </div>
   );
}
