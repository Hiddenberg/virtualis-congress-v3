"use client";

import {
   FileTextIcon,
   InfoIcon,
   MailIcon,
   MonitorIcon,
   SendIcon,
   UserIcon,
   VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { scheduleRecordingAction } from "@/features/simpleRecordings/serverActions/recordingsActions";

interface RecordingForm {
   title: string;
   personName: string;
   personEmail: string;
   sendInvitation: boolean;
   recordingType: SimpleRecording["recordingType"];
}

interface CreateRecordingFormProps {
   campaignId: string;
}

export default function CreateRecordingForm({
   campaignId,
}: CreateRecordingFormProps) {
   const [recordingForm, setRecordingForm] = useState<RecordingForm>({
      title: "",
      personName: "",
      personEmail: "",
      sendInvitation: true,
      recordingType: "camera_and_presentation",
   });

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isCreatingRecording, startTransition] = useTransition();
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      // Validation
      const validation = z.object({
         title: z.string().min(1, {
            message: "El título es requerido",
         }),
         personName: z.string().min(1, {
            message: "El nombre es requerido",
         }),
         personEmail: z.string().email({
            message: "El correo electrónico no es válido",
         }),
      });

      const result = validation.safeParse(recordingForm);

      if (!result.success) {
         const newErrors: Record<string, string> = {};
         result.error.errors.forEach((error) => {
            if (error.path[0]) {
               newErrors[error.path[0] as string] = error.message;
            }
         });
         setErrors(newErrors);
         return;
      }

      startTransition(async () => {
         const response = await scheduleRecordingAction({
            title: recordingForm.title,
            campaignId: campaignId,
            personName: recordingForm.personName,
            personEmail: recordingForm.personEmail,
            sendInvitation: recordingForm.sendInvitation,
            recordingType: recordingForm.recordingType,
         });

         if (!response.success) {
            toast.error(response.errorMessage || "Error al crear la grabación");
            return;
         }

         toast.success("Grabación programada correctamente");
         router.push(`/recordings/campaign/${campaignId}`);
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
               {/* Title Field */}
               <fieldset className="space-y-2">
                  <label
                     htmlFor="title"
                     className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                  >
                     <FileTextIcon className="size-4" />
                     Título de la grabación{" "}
                     <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="title"
                     name="title"
                     type="text"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     placeholder="Ej. Entrevista con el Dr. García sobre Neurología"
                     value={recordingForm.title}
                     onChange={(e) =>
                        setRecordingForm({
                           ...recordingForm,
                           title: e.target.value,
                        })
                     }
                  />
                  {errors.title && (
                     <p className="text-red-600 text-sm">{errors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                     Describe brevemente el contenido o propósito de esta
                     grabación
                  </p>
               </fieldset>

               {/* Person Name Field */}
               <fieldset className="space-y-2">
                  <label
                     htmlFor="personName"
                     className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                  >
                     <UserIcon className="size-4" />
                     Nombre de la persona que grabará{" "}
                     <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="personName"
                     name="personName"
                     type="text"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     placeholder="Ej. Dr. María García"
                     value={recordingForm.personName}
                     onChange={(e) =>
                        setRecordingForm({
                           ...recordingForm,
                           personName: e.target.value,
                        })
                     }
                  />
                  {errors.personName && (
                     <p className="text-red-600 text-sm">{errors.personName}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                     Nombre completo de la persona que realizará la grabación
                  </p>
               </fieldset>

               {/* Person Email Field */}
               <fieldset className="space-y-2">
                  <label
                     htmlFor="personEmail"
                     className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                  >
                     <MailIcon className="size-4" />
                     Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="personEmail"
                     type="email"
                     placeholder="doctor.garcia@example.com"
                     className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                     value={recordingForm.personEmail}
                     onChange={(e) =>
                        setRecordingForm({
                           ...recordingForm,
                           personEmail: e.target.value,
                        })
                     }
                  />
                  {errors.personEmail && (
                     <p className="text-red-600 text-sm">
                        {errors.personEmail}
                     </p>
                  )}
                  <p className="text-gray-500 text-xs">
                     Se enviará una invitación con instrucciones a este correo
                  </p>
               </fieldset>

               {/* Recording Type Field */}
               <fieldset className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
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
                           checked={
                              recordingForm.recordingType ===
                              "camera_and_presentation"
                           }
                           onChange={(e) =>
                              setRecordingForm({
                                 ...recordingForm,
                                 recordingType: e.target
                                    .value as SimpleRecording["recordingType"],
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
                           checked={
                              recordingForm.recordingType === "only_camera"
                           }
                           onChange={(e) =>
                              setRecordingForm({
                                 ...recordingForm,
                                 recordingType: e.target
                                    .value as SimpleRecording["recordingType"],
                              })
                           }
                           className="border-gray-300 focus:ring-blue-500 size-4 text-blue-600"
                        />
                        <label
                           htmlFor="only_camera"
                           className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"
                        >
                           <VideoIcon className="size-4" />
                           Solo cámara
                        </label>
                     </div>
                  </div>
                  {recordingForm.recordingType === "only_camera" && (
                     <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                           <InfoIcon className="flex-shrink-0 mt-0.5 size-4 text-blue-600" />
                           <div>
                              <p className="font-medium text-blue-800 text-sm">
                                 Perfecto para contenido personal
                              </p>
                              <p className="mt-1 text-blue-700 text-xs">
                                 Esta opción es ideal para presentaciones
                                 directas a cámara, videos testimoniales,
                                 entrevistas personales, o cualquier contenido
                                 donde el foco principal sea el presentador sin
                                 necesidad de mostrar pantallas o diapositivas.
                              </p>
                           </div>
                        </div>
                     </div>
                  )}
                  <p className="text-gray-500 text-xs">
                     Selecciona el tipo de grabación que mejor se adapte a las
                     necesidades del contenido
                  </p>
               </fieldset>

               {/* Send Invitation Checkbox */}
               <fieldset className="space-y-2">
                  <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-lg">
                     <div className="flex items-start gap-3">
                        <input
                           id="sendInvitation"
                           name="sendInvitation"
                           type="checkbox"
                           className="mt-1 border-gray-300 rounded focus:ring-blue-500 size-4 text-blue-600"
                           checked={recordingForm.sendInvitation}
                           onChange={(e) =>
                              setRecordingForm({
                                 ...recordingForm,
                                 sendInvitation: e.target.checked,
                              })
                           }
                        />
                        <div className="flex-1">
                           <label
                              htmlFor="sendInvitation"
                              className="flex items-center gap-2 font-medium text-yellow-900 text-sm"
                           >
                              <SendIcon className="size-4" />
                              Enviar invitación por correo electrónico
                           </label>
                           <p className="mt-1 text-yellow-700 text-xs">
                              Si está marcado, se enviará automáticamente un
                              correo con las instrucciones de grabación. Si no,
                              podrás enviarlo manualmente más tarde.
                           </p>
                        </div>
                     </div>
                  </div>
               </fieldset>

               {/* Action Buttons */}
               <div className="pt-4 border-gray-100 border-t">
                  <div className="flex justify-end gap-3">
                     <Button
                        variant="secondary"
                        type="button"
                        disabled={isCreatingRecording}
                        onClick={() => router.back()}
                     >
                        Cancelar
                     </Button>
                     <Button
                        variant="primary"
                        type="submit"
                        loading={isCreatingRecording}
                        disabled={isCreatingRecording}
                     >
                        {isCreatingRecording
                           ? "Programando..."
                           : "Programar grabación"}
                     </Button>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
