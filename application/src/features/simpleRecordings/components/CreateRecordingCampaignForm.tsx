"use client";

import { FileTextIcon, FolderIcon, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { createRecordingCampaignAction } from "../serverActions/recordingsCampaignActions";

export default function CreateRecordingCampaignForm() {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [creating, startTransition] = useTransition();

   const router = useRouter();

   const handleSubmit = () => {
      if (!title.trim()) {
         return; // Basic validation - could be enhanced with proper error states
      }

      startTransition(async () => {
         const response = await createRecordingCampaignAction(
            title,
            description,
         );

         if (response.success) {
            toast.success("Campaña creada correctamente");
            router.push(`/recordings`);
         }
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         {/* Information Card */}
         <div className="bg-blue-50 mb-6 p-4 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                  <InfoIcon className="size-5 text-blue-600" />
               </div>
               <div>
                  <h3 className="mb-1 font-semibold text-blue-900">
                     ¿Qué es una campaña de grabación?
                  </h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                     Las campañas te permiten organizar y gestionar múltiples
                     grabaciones de manera eficiente. Puedes agrupar grabaciones
                     relacionadas bajo un mismo tema o proyecto para mejor
                     organización.
                  </p>
               </div>
            </div>
         </div>

         {/* Main Form Card */}
         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-yellow-100 p-2 rounded-full">
                  <FolderIcon className="size-6 text-yellow-600" />
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 text-xl">
                     Crear nueva campaña
                  </h2>
                  <p className="text-gray-500 text-sm">
                     Completa la información básica para tu campaña de grabación
                  </p>
               </div>
            </div>

            <form className="space-y-6">
               {/* Title Field */}
               <fieldset className="space-y-2">
                  <label
                     htmlFor="campaign-title"
                     className="block font-medium text-gray-700 text-sm"
                  >
                     Nombre de la campaña{" "}
                     <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="campaign-title"
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="Ej. Conferencias de Marketing Digital 2024"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     required
                  />
                  <p className="text-gray-500 text-xs">
                     Escoge un nombre descriptivo que te ayude a identificar
                     fácilmente esta campaña
                  </p>
               </fieldset>

               {/* Description Field */}
               <fieldset className="space-y-2">
                  <label
                     htmlFor="campaign-description"
                     className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                  >
                     <FileTextIcon className="size-4" />
                     Descripción (opcional)
                  </label>
                  <textarea
                     id="campaign-description"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Describe brevemente el propósito de esta campaña de grabación..."
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors resize-none"
                     rows={4}
                  />
                  <p className="text-gray-500 text-xs">
                     Una descripción opcional para proporcionar más contexto
                     sobre esta campaña
                  </p>
               </fieldset>

               {/* Action Buttons */}
               <div className="pt-4 border-gray-100 border-t">
                  <div className="flex justify-end gap-3">
                     <Button
                        variant="secondary"
                        type="button"
                        disabled={creating}
                        onClick={() => window.history.back()}
                     >
                        Cancelar
                     </Button>
                     <Button
                        variant="primary"
                        type="button"
                        loading={creating}
                        onClick={handleSubmit}
                        disabled={!title.trim() || creating}
                     >
                        {creating ? "Creando campaña..." : "Crear campaña"}
                     </Button>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
