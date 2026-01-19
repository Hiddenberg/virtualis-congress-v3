"use client";
import { format } from "@formkit/tempo";
import { Save, Tag } from "lucide-react";
// import ClientSpeakerSelector from "@/app/congress-admin/conferences/[conferenceId]/edit/client-speaker-selector";
import { useRouter } from "next/navigation";
import type { RecordModel } from "pocketbase";
import { useState } from "react";
import { updateConferenceAction } from "@/features/conferences/actions/conferenceActions";
import type { NewConferenceData } from "@/features/conferences/services/conferenceServices";

export default function EditConferenceForm({
   initialConference,
   // allSpeakers,
   availablePresenters,
}: {
   initialConference: CongressConference & RecordModel;
   allSpeakers: {
      id: string;
      name: string;
   }[];
   availablePresenters: {
      id: string;
      name: string;
   }[];
}) {
   const [updating, setUpdating] = useState<boolean | null>(null);
   const router = useRouter();

   async function handleSubmit(formData: FormData) {
      setUpdating(true);

      const startTime = formData.get("startTime") as string;
      const endTime = formData.get("endTime") as string;
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);

      // NOTE: speakerIds is not included in the newConferenceData because it is no longer part of the NewConferenceData type
      // REFACTOR: This is a temporary fix to allow the updateConferenceAction to work
      const newConferenceData: Partial<NewConferenceData> = {
         title: formData.get("title") as string,
         shortDescription: formData.get("shortDescription") as string,
         startTime: startTimeDate.toISOString(),
         endTime: endTimeDate.toISOString(),
      };

      if (startTimeDate > endTimeDate) {
         alert("La hora de inicio debe ser anterior a la hora de finalización");
         setUpdating(false);
         return;
      }

      formData.set("startTime", startTimeDate.toISOString());
      formData.set("endTime", endTimeDate.toISOString());

      const updateResult = await updateConferenceAction({
         conferenceId: initialConference.id,
         newConferenceData: newConferenceData,
      });

      if (!updateResult.success) {
         alert(updateResult.errorMessage);
         return;
      }

      router.push(`/congress-admin/conference-calendar/`);
      setUpdating(false);
   }

   return (
      <form
         action={handleSubmit}
         className="space-y-6 bg-white shadow-sm p-6 rounded-lg"
      >
         <div>
            <label htmlFor="title" className="block mb-1 font-medium text-sm">
               Título <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={initialConference.title}
                  required
                  placeholder="Título de la conferencia"
                  className="px-3 py-2 pr-10 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
               />
               <Tag className="top-1/2 right-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
            </div>
         </div>

         <div>
            <label
               htmlFor="shortDescription"
               className="block mb-1 font-medium text-sm"
            >
               Descripción Breve
            </label>
            <textarea
               id="shortDescription"
               name="shortDescription"
               defaultValue={initialConference.shortDescription || ""}
               placeholder="Ingresa una breve descripción de la conferencia"
               rows={3}
               className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
         </div>

         <div className="gap-4 grid md:grid-cols-2">
            <div>
               <label
                  htmlFor="startTime"
                  className="block mb-1 font-medium text-sm"
               >
                  Hora de Inicio <span className="text-red-500">*</span>
               </label>
               <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  defaultValue={format({
                     date: initialConference.startTime,
                     format: "YYYY-MM-DDTHH:mm",
                     tz: "America/Mexico_City",
                  })}
                  required
                  className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
               />
            </div>

            <div>
               <label
                  htmlFor="endTime"
                  className="block mb-1 font-medium text-sm"
               >
                  Hora de Finalización <span className="text-red-500">*</span>
               </label>
               <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  defaultValue={format({
                     date: initialConference.endTime,
                     format: "YYYY-MM-DDTHH:mm",
                     tz: "America/Mexico_City",
                  })}
                  required
                  className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
               />
            </div>
         </div>

         {/* Hidden input to store speakerIds as a comma-separated string for form submission */}
         <input
            type="hidden"
            name="speakerIds"
            id="speakerIds"
            defaultValue={initialConference.speakers.join(",")}
         />

         {/* Client component needs to be wrapped */}
         {/* <ClientSpeakerSelector
            defaultSpeakers={initialConference.speakers}
            allSpeakers={allSpeakers}
         /> */}

         <div className="gap-4 grid md:grid-cols-2">
            <div>
               <label
                  htmlFor="conferenceType"
                  className="block mb-1 font-medium text-sm"
               >
                  Tipo de Conferencia <span className="text-red-500">*</span>
               </label>
               <select
                  id="conferenceType"
                  name="conferenceType"
                  defaultValue={initialConference.conferenceType}
                  required
                  className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
               >
                  <option value="individual">Individual</option>
                  <option value="group">Grupal</option>
               </select>
            </div>
         </div>

         <div className="mt-4">
            <label htmlFor="status" className="block mb-1 font-medium text-sm">
               Estado de la Conferencia <span className="text-red-500">*</span>
            </label>
            <select
               id="status"
               name="status"
               defaultValue={initialConference.status}
               required
               className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            >
               <option value="scheduled">Programada</option>
               <option value="recorded">Grabada</option>
               <option value="live">En vivo</option>
               <option value="finished">Finalizada</option>
               <option value="canceled">Cancelada</option>
            </select>
            <p className="mt-1 text-gray-500 text-sm">
               Estado actual de la conferencia
            </p>
         </div>

         <div>
            <label
               htmlFor="presenter"
               className="block mb-1 font-medium text-sm"
            >
               Presentador
            </label>
            <select
               id="presenter"
               name="presenter"
               defaultValue={initialConference.presenter || ""}
               className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            >
               <option value="">Seleccionar un presentador</option>
               {availablePresenters.map((presenter) => (
                  <option key={presenter.id} value={presenter.id}>
                     {presenter.name}
                  </option>
               ))}
            </select>
            <p className="mt-1 text-gray-500 text-sm">
               El presentador introducirá la conferencia antes de que comience
            </p>
         </div>

         <div className="flex justify-end pt-4 border-gray-100 border-t">
            <button
               type="submit"
               disabled={updating === true}
               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white transition-colors"
            >
               <Save className="w-4 h-4" />
               <span>
                  {updating === true ? "Guardando..." : "Guardar Cambios"}
               </span>
            </button>
         </div>
      </form>
   );
}
