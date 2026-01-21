"use client";

import { CheckIcon, PencilIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/global/Buttons";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";
import type { CertificateDesignRecord } from "../types/certificatesTypes";
import CertificateComponent from "./CertificateComponent";

function EditDisplayNamePopUp({ onSave, onCancel }: { onSave: (displayName: string) => void; onCancel?: () => void }) {
   const displayNameInputRef = useRef<HTMLInputElement>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [displayName, setDisplayName] = useState("");

   const handleSave = async () => {
      const name = displayNameInputRef.current?.value.trim() || "";

      if (!name) {
         return;
      }

      setIsLoading(true);
      try {
         await onSave(name);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="bg-white mx-auto max-w-md">
         <div className="mb-6 text-center">
            <div className="flex justify-center items-center bg-indigo-100 mx-auto mb-4 rounded-full w-16 h-16">
               <PencilIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="mb-2 font-semibold text-gray-900 text-xl">
               Ingresa cómo quieres que aparezca tu nombre en tus certificados
            </h2>
         </div>

         <div className="space-y-4">
            <div>
               <label htmlFor="displayName" className="block mb-2 font-medium text-gray-700 text-sm">
                  Nombre para certificados
               </label>
               <input
                  id="displayName"
                  type="text"
                  ref={displayNameInputRef}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Dr. Juan Pérez García"
                  className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                  disabled={isLoading}
               />
            </div>

            <div className="flex gap-3 pt-4">
               {onCancel && (
                  <Button variant="secondary" className="flex-1" disabled={isLoading} onClick={onCancel}>
                     Cancelar
                  </Button>
               )}
               <Button
                  variant="purple"
                  className="flex-1"
                  loading={isLoading}
                  onClick={handleSave}
                  disabled={!displayName.trim()}
               >
                  <CheckIcon className="mr-2 w-4 h-4" />
                  Guardar
               </Button>
            </div>
         </div>
      </div>
   );
}

export default function CreateSpeakerCertificateForm({
   speakerCertificateDesign,
}: {
   speakerCertificateDesign: CertificateDesignRecord;
}) {
   const [displayName, setDisplayName] = useState<string | null>(null);

   const mountedRef = useRef(false);
   const { showInPopUp, closePopUp } = useGlobalPopUpContext();

   useEffect(() => {
      if (!displayName && !mountedRef.current) {
         mountedRef.current = true;
         showInPopUp(
            <EditDisplayNamePopUp
               onSave={(displayName) => {
                  setDisplayName(displayName);
                  closePopUp();
               }}
            />,
            {
               hasCloseButton: false,
            },
         );
      }
   }, [displayName, showInPopUp, closePopUp]);

   if (!displayName) {
      return null;
   }

   return (
      <div>
         <Button
            onClick={() => {
               showInPopUp(
                  <EditDisplayNamePopUp
                     onSave={(displayName) => {
                        setDisplayName(displayName);
                        closePopUp();
                     }}
                     onCancel={() => {
                        closePopUp();
                     }}
                  />,
               );
            }}
            className="!bg-purple-400 hover:!bg-purple-500 mx-auto mb-4 text-white"
         >
            <PencilIcon className="mr-2 size-4" />
            Editar nombre
         </Button>

         <div className="flex flex-wrap gap-4">
            <CertificateComponent certificateDesign={speakerCertificateDesign} displayName={displayName || ""} />
         </div>
      </div>
   );
}
