"use client";

import { FileTextIcon, InfoIcon, MailIcon, MonitorIcon, UserIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { updateRecordingDetailsAction } from "@/features/simpleRecordings/serverActions/recordingsActions";
import type { SimpleRecording, SimpleRecordingRecord } from "../types/recordingsTypes";

interface EditRecordingFormProps {
   recording: SimpleRecordingRecord;
   campaignId: string;
}

export default function EditRecordingForm({ recording, campaignId }: EditRecordingFormProps) {
   const [formData, setFormData] = useState({
      title: recording.title,
      recorderName: recording.recorderName ?? "",
      recorderEmail: recording.recorderEmail ?? "",
      recordingType: recording.recordingType,
   });

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isUpdating, startTransition] = useTransition();
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      const validation = z.object({
         title: z.string().min(1, {
            message: "El título es requerido",
         }),
      });

      const result = validation.safeParse(formData);

      if (!result.success) {
         const newErrors: Record<string, string> = {};
         result.error.issues.forEach((error) => {
            if (error.path[0]) {
               newErrors[error.path[0] as string] = error.message;
            }
         });
         setErrors(newErrors);
         return;
      }

      startTransition(async () => {
         const response = await updateRecordingDetailsAction(recording.id, campaignId, {
            title: formData.title,
            recorderName: formData.recorderName,
            recorderEmail: formData.recorderEmail,
            recordingType: formData.recordingType as SimpleRecording["recordingType"],
         });

         if (!response.success) {
            toast.error(response.errorMessage || "Error al actualizar la grabación");
            return;
         }

         toast.success("Grabación actualizada correctamente");
         router.push(`/recordings/campaign/${campaignId}`);
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
               {/* Title Field */}
               <fieldset className="space-y-2">
                  <label htmlFor="title" className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                     <FileTextIcon className="size-4" />
                     Título de la grabación <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="title"
                     name="title"
                     type="text"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     placeholder="Ej. Entrevista con el Dr. García sobre Neurología"
                     value={formData.title}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           title: e.target.value,
                        })
                     }
                  />
                  {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
                  <p className="text-gray-500 text-xs">Describe brevemente el contenido o propósito de esta grabación</p>
               </fieldset>

               {/* Recorder Name Field */}
               <fieldset className="space-y-2">
                  <label htmlFor="recorderName" className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                     <UserIcon className="size-4" />
                     Nombre quien graba <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="recorderName"
                     name="recorderName"
                     type="text"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     placeholder="Ej. Dr. María García"
                     value={formData.recorderName}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           recorderName: e.target.value,
                        })
                     }
                  />
                  {errors.recorderName && <p className="text-red-600 text-sm">{errors.recorderName}</p>}
                  <p className="text-gray-500 text-xs">Nombre completo de la persona que realizará o realizó la grabación</p>
               </fieldset>

               {/* Recorder Email Field */}
               <fieldset className="space-y-2">
                  <label htmlFor="recorderEmail" className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                     <MailIcon className="size-4" />
                     Correo electrónico de quien graba <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="recorderEmail"
                     name="recorderEmail"
                     type="email"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     placeholder="doctor.garcia@example.com"
                     value={formData.recorderEmail}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           recorderEmail: e.target.value,
                        })
                     }
                  />
                  {errors.recorderEmail && <p className="text-red-600 text-sm">{errors.recorderEmail}</p>}
                  <p className="text-gray-500 text-xs">Correo electrónico de la persona que realiza la grabación</p>
               </fieldset>

               {/* Recording Type Field */}
               <fieldset className="space-y-2">
                  <label htmlFor="recordingType" className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                     <VideoIcon className="size-4" />
                     Tipo de grabación
                  </label>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <input
                           id="camera_and_presentation"
                           name="recordingType"
                           type="radio"
                           value="camera_and_presentation"
                           checked={formData.recordingType === "camera_and_presentation"}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 recordingType: e.target.value as SimpleRecording["recordingType"],
                              })
                           }
                           className="border-gray-300 focus:ring-blue-500 size-4 text-blue-600"
                        />
                        <label
                           htmlFor="camera_and_presentation"
                           className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"
                        >
                           <MonitorIcon className="size-4" />
                           Cámara y presentación/pantalla
                        </label>
                     </div>
                     <div className="flex items-center gap-3">
                        <input
                           id="only_camera"
                           name="recordingType"
                           type="radio"
                           value="only_camera"
                           checked={formData.recordingType === "only_camera"}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 recordingType: e.target.value as SimpleRecording["recordingType"],
                              })
                           }
                           className="border-gray-300 focus:ring-blue-500 size-4 text-blue-600"
                        />
                        <label htmlFor="only_camera" className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                           <VideoIcon className="size-4" />
                           Solo cámara
                        </label>
                     </div>
                  </div>
                  {formData.recordingType === "only_camera" && (
                     <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                           <InfoIcon className="mt-0.5 size-4 text-blue-600 shrink-0" />
                           <div>
                              <p className="font-medium text-blue-800 text-sm">Perfecto para contenido personal</p>
                              <p className="mt-1 text-blue-700 text-xs">
                                 Esta opción es ideal para presentaciones directas a cámara, videos testimoniales, entrevistas
                                 personales, o cualquier contenido donde el foco principal sea el presentador sin necesidad de
                                 mostrar pantallas o diapositivas.
                              </p>
                           </div>
                        </div>
                     </div>
                  )}
                  <p className="text-gray-500 text-xs">
                     Selecciona el tipo de grabación que mejor se adapte a las necesidades del contenido
                  </p>
               </fieldset>

               {/* Action Buttons */}
               <div className="pt-4 border-gray-100 border-t">
                  <div className="flex justify-end gap-3">
                     <Button variant="secondary" type="button" disabled={isUpdating} onClick={() => router.back()}>
                        Cancelar
                     </Button>
                     <Button variant="primary" type="submit" loading={isUpdating} disabled={isUpdating}>
                        {isUpdating ? "Guardando..." : "Guardar cambios"}
                     </Button>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
