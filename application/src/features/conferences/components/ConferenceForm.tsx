"use client";

import { format } from "@formkit/tempo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import {
   createConferenceAction,
   updateConferenceAction,
} from "@/features/conferences/actions/conferenceActions";
import {
   linkSpeakersToConferenceAction,
   unlinkSpeakersFromConferenceAction,
} from "@/features/conferences/actions/conferenceSpeakersActions";
import ConferenceTypeSelector from "@/features/conferences/components/form/ConferenceTypeSelector";
import FormField from "@/features/conferences/components/form/FormField";
import SpeakersMultiSelect from "@/features/conferences/components/form/SpeakersMultiSelect";
import { SpeakerDataRecord } from "@/types/congress";

interface ConferenceFormProps {
   speakersAvailable: { id: string; name: string }[];
   mode: "create" | "edit";
   conference?: CongressConferenceRecord;
   conferenceSpeakers?: SpeakerDataRecord[] | null;
}

export function ConferenceForm({
   speakersAvailable,
   mode,
   conference,
   conferenceSpeakers,
}: ConferenceFormProps) {
   type FormState = Omit<
      CongressConference,
      "organization" | "congress" | "status"
   > & {
      selectedSpeakerIds?: string[];
   };

   const initialFormState: FormState = useMemo(() => {
      if (mode === "edit" && conference) {
         return {
            title: conference.title,
            shortDescription: conference.shortDescription ?? "",
            startTime: format({
               date: conference.startTime,
               format: "YYYY-MM-DDTHH:mm",
            }),
            endTime: format({
               date: conference.endTime,
               format: "YYYY-MM-DDTHH:mm",
            }),
            conferenceType: conference.conferenceType,
         };
      }

      return {
         title: "",
         shortDescription: "",
         startTime: "",
         endTime: "",
         conferenceType: "in-person",
         selectedSpeakerIds: [],
      };
   }, [mode, conference]);

   const [formData, setFormData] = useState<FormState>({
      ...initialFormState,
      selectedSpeakerIds: (conferenceSpeakers || []).map((s) => s.id),
   });
   const [formErrors, setFormErrors] = useState<
      Partial<Record<keyof FormState, string>>
   >({});
   const [isSaving, startTransition] = useTransition();
   const router = useRouter();

   if (mode === "edit" && !conference) {
      return (
         <div className="text-red-600">
            Conference data was not provided to edit.
         </div>
      );
   }

   const validate = (): boolean => {
      const errors: Partial<Record<keyof FormState, string>> = {};
      if (!formData.title.trim()) {
         errors.title = "El título es requerido";
      }
      if (!formData.startTime) {
         errors.startTime = "La fecha de inicio es requerida";
      }
      if (!formData.endTime) {
         errors.endTime = "La fecha de término es requerida";
      }
      if (formData.startTime && formData.endTime) {
         const start = new Date(formData.startTime);
         const end = new Date(formData.endTime);
         if (start >= end) {
            errors.endTime =
               "La hora de término debe ser posterior a la de inicio";
         }
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const runCreateFlow = async () => {
      const createConferenceResponse = await createConferenceAction({
         title: formData.title,
         shortDescription: formData.shortDescription,
         startTime: new Date(formData.startTime).toISOString(),
         endTime: new Date(formData.endTime).toISOString(),
         conferenceType: formData.conferenceType,
      });

      if (!createConferenceResponse.success) {
         toast.error(createConferenceResponse.errorMessage);
         return null;
      }

      if (
         formData.selectedSpeakerIds &&
         formData.selectedSpeakerIds.length > 0
      ) {
         const linkResponse = await linkSpeakersToConferenceAction({
            conferenceId: createConferenceResponse.data.id,
            speakerIds: formData.selectedSpeakerIds,
         });
         if (!linkResponse.success) {
            toast.error(linkResponse.errorMessage);
            return null;
         }
      }

      return createConferenceResponse.data;
   };

   const runUpdateFlow = async () => {
      if (!conference) {
         toast.error("Conference data was not provided to edit");
         return false;
      }

      const updateConferenceResponse = await updateConferenceAction({
         conferenceId: conference.id,
         newConferenceData: {
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
         },
      });

      if (!updateConferenceResponse.success) {
         toast.error(updateConferenceResponse.errorMessage);
         return false;
      }

      const initialIds = (conferenceSpeakers || []).map(
         (speaker) => speaker.id,
      );
      const selectedIds = formData.selectedSpeakerIds || [];
      const toLink = selectedIds.filter((id) => !initialIds.includes(id));
      const toUnlink = initialIds.filter((id) => !selectedIds.includes(id));

      if (toLink.length > 0) {
         const linkResp = await linkSpeakersToConferenceAction({
            conferenceId: conference.id,
            speakerIds: toLink,
         });
         if (!linkResp.success) {
            toast.error(linkResp.errorMessage);
            return false;
         }
      }
      if (toUnlink.length > 0) {
         const unlinkResp = await unlinkSpeakersFromConferenceAction({
            conferenceId: conference.id,
            speakerIds: toUnlink,
         });
         if (!unlinkResp.success) {
            toast.error(unlinkResp.errorMessage);
            return false;
         }
      }

      return true;
   };

   const handleSubmit = async () => {
      if (!validate()) {
         toast.error("Por favor corrige los errores del formulario");
         return;
      }

      startTransition(async () => {
         if (mode === "edit") {
            const ok = await runUpdateFlow();
            if (!ok) return;
            toast.success("Conferencia actualizada correctamente");
            router.push(`/congress-admin/conferences`);
            return;
         }

         const created = await runCreateFlow();
         if (!created) return;
         toast.success("Conferencia creada correctamente");
         router.push(`/congress-admin/conferences`);
      });
   };

   const handleSaveAndCreateAnother = async () => {
      if (!validate()) {
         toast.error("Por favor corrige los errores del formulario");
         return;
      }

      startTransition(async () => {
         const created = await runCreateFlow();
         if (!created) return;
         toast.success("Conferencia creada correctamente");
         setFormData({
            ...initialFormState,
            startTime: formData.startTime,
            endTime: formData.endTime,
            selectedSpeakerIds: [],
         });
      });
   };

   const handleChange = (field: keyof FormState, value: string) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
      if (formErrors[field]) {
         setFormErrors((prev) => ({
            ...prev,
            [field]: undefined,
         }));
      }
   };

   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
         <div className="flex flex-col justify-between items-start mb-6">
            <button
               type="button"
               onClick={() => router.back()}
               className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900"
            >
               <ArrowLeft className="w-4 h-4" />
               <span>Volver</span>
            </button>
            <div>
               <h2 className="mb-1 font-semibold text-gray-900 text-xl">
                  {mode === "create"
                     ? "Nueva Conferencia"
                     : "Editar Conferencia"}
               </h2>
               <p className="text-gray-600 text-sm">
                  Completa la información básica de la conferencia
               </p>
            </div>
         </div>

         <div className="gap-6 grid grid-cols-1">
            <div className="space-y-4">
               <FormField
                  label="Título"
                  error={formErrors.title}
                  htmlFor="conference-title"
               >
                  <input
                     id="conference-title"
                     type="text"
                     value={formData.title}
                     onChange={(e) => handleChange("title", e.target.value)}
                     placeholder="Ingresa el título de la conferencia"
                     className={`w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.title ? "border-red-300" : "border-gray-300"}`}
                  />
               </FormField>

               <FormField
                  label="Descripción corta"
                  htmlFor="conference-short-description"
               >
                  <textarea
                     id="conference-short-description"
                     value={formData.shortDescription}
                     onChange={(e) =>
                        handleChange("shortDescription", e.target.value)
                     }
                     placeholder="Breve descripción de la conferencia"
                     rows={4}
                     className="bg-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
               </FormField>
            </div>

            <div className="space-y-4">
               <FormField
                  label="Inicio"
                  error={formErrors.startTime}
                  htmlFor="conference-start"
               >
                  <input
                     id="conference-start"
                     type="datetime-local"
                     value={formData.startTime}
                     onChange={(e) => handleChange("startTime", e.target.value)}
                     className={`w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.startTime ? "border-red-300" : "border-gray-300"}`}
                  />
               </FormField>

               <FormField
                  label="Término"
                  error={formErrors.endTime}
                  htmlFor="conference-end"
               >
                  <input
                     id="conference-end"
                     type="datetime-local"
                     value={formData.endTime}
                     onChange={(e) => handleChange("endTime", e.target.value)}
                     className={`w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.endTime ? "border-red-300" : "border-gray-300"}`}
                  />
               </FormField>

               <FormField label="Tipo de conferencia">
                  <ConferenceTypeSelector
                     value={formData.conferenceType}
                     onChange={(val) => handleChange("conferenceType", val)}
                  />
               </FormField>
            </div>
         </div>

         {mode === "create" && formData.conferenceType !== "break" && (
            <div className="mt-6">
               <FormField label="Ponentes (opcional)">
                  <SpeakersMultiSelect
                     speakers={speakersAvailable}
                     valueIds={formData.selectedSpeakerIds || []}
                     onChange={(ids) =>
                        setFormData((prev) => ({
                           ...prev,
                           selectedSpeakerIds: ids,
                        }))
                     }
                  />
               </FormField>
               <p className="mt-1 text-gray-500 text-xs">
                  Puedes dejar este campo vacío y vincular ponentes después.
               </p>
            </div>
         )}

         <div className="flex justify-end gap-3 mt-8">
            <Button
               onClick={() => router.back()}
               variant="outline"
               className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
               disabled={isSaving}
            >
               Cancelar
            </Button>
            <Button
               variant="blue"
               onClick={handleSubmit}
               disabled={isSaving}
               loading={isSaving}
            >
               {isSaving
                  ? "Guardando..."
                  : mode === "create"
                    ? "Crear conferencia"
                    : "Guardar cambios"}
            </Button>
            {mode === "create" && (
               <Button
                  variant="blue"
                  onClick={handleSaveAndCreateAnother}
                  disabled={isSaving}
                  loading={isSaving}
               >
                  {isSaving ? "Guardando..." : "Guardar y crear otra"}
               </Button>
            )}
         </div>
      </div>
   );
}
