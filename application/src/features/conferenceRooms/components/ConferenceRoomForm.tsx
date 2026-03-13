"use client";

import { ArrowLeft, LayoutGrid, MessageSquareText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { createConferenceRoomAction, updateConferenceRoomAction } from "../actions/conferenceRoomsActions";
import type { ConferenceRoomRecord } from "../types/conferenceRoomsTypes";

interface ConferenceRoomFormProps {
   mode: "create" | "edit";
   conferenceRoom?: ConferenceRoomRecord;
}

interface FormState {
   name: string;
   description: string;
}

export default function ConferenceRoomForm({ mode, conferenceRoom }: ConferenceRoomFormProps) {
   const router = useRouter();
   const [isSaving, startTransition] = useTransition();
   const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});

   const initialFormState = useMemo<FormState>(() => {
      if (mode === "edit" && conferenceRoom) {
         return {
            name: conferenceRoom.name,
            description: conferenceRoom.description ?? "",
         };
      }

      return {
         name: "",
         description: "",
      };
   }, [mode, conferenceRoom]);

   const [formData, setFormData] = useState<FormState>(initialFormState);

   if (mode === "edit" && !conferenceRoom) {
      return <div className="text-red-600">Conference room data was not provided to edit.</div>;
   }

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

   const validate = () => {
      const errors: Partial<Record<keyof FormState, string>> = {};

      if (!formData.name.trim()) {
         errors.name = "El nombre de la sala es requerido";
      } else if (formData.name.trim().length < 2) {
         errors.name = "El nombre debe tener al menos 2 caracteres";
      }

      if (formData.description.trim().length > 240) {
         errors.description = "La descripción no puede exceder 240 caracteres";
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = () => {
      if (!validate()) {
         toast.error("Por favor corrige los errores del formulario");
         return;
      }

      startTransition(async () => {
         if (mode === "edit" && conferenceRoom) {
            const updateResponse = await updateConferenceRoomAction({
               conferenceRoomId: conferenceRoom.id,
               newConferenceRoomData: {
                  name: formData.name.trim(),
                  description: formData.description.trim() || undefined,
               },
            });

            if (!updateResponse.success) {
               toast.error(updateResponse.errorMessage);
               return;
            }

            toast.success("Sala actualizada correctamente");
            router.push("/congress-admin/conference-rooms");
            router.refresh();
            return;
         }

         const createResponse = await createConferenceRoomAction({
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
         });

         if (!createResponse.success) {
            toast.error(createResponse.errorMessage);
            return;
         }

         toast.success("Sala creada correctamente");
         router.push("/congress-admin/conference-rooms");
         router.refresh();
      });
   };

   const title = mode === "create" ? "Nueva sala de conferencia" : "Editar sala de conferencia";
   const subtitle =
      mode === "create"
         ? "Crea un espacio claro y fácil de identificar para organizar sesiones simultáneas."
         : "Actualiza el nombre y la descripción para mantener el programa bien organizado.";

   return (
      <div className="mx-auto w-full max-w-5xl">
         <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4 mb-8">
            <div>
               <button
                  type="button"
                  onClick={() => router.push("/congress-admin/conference-rooms")}
                  className="inline-flex items-center gap-2 mb-4 rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
               >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a salas</span>
               </button>
               <h1 className="mb-2 font-bold text-3xl text-gray-900">{title}</h1>
               <p className="max-w-2xl text-gray-600">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 text-sm">
               <LayoutGrid className="w-4 h-4" />
               <span>{mode === "create" ? "Nueva configuración" : "Modo edición"}</span>
            </div>
         </div>

         <div className="gap-6 grid lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
            <section className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
               <div className="border-b border-gray-200 bg-linear-to-r from-blue-50 to-white px-6 py-5">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center justify-center rounded-xl bg-blue-600 w-11 h-11 text-white">
                        <LayoutGrid className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="font-semibold text-gray-900 text-lg">Información de la sala</h2>
                        <p className="text-gray-600 text-sm">Define cómo se mostrará esta sala a los administradores y asistentes.</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6 p-6">
                  <div>
                     <label htmlFor="conference-room-name" className="mb-2 block font-medium text-gray-800 text-sm">
                        Nombre de la sala
                     </label>
                     <input
                        id="conference-room-name"
                        type="text"
                        value={formData.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        placeholder="Ej. Auditorio principal"
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           formErrors.name ? "border-red-300" : "border-gray-300"
                        }`}
                     />
                     <div className="mt-2 flex justify-between gap-4 text-xs">
                        <span className={formErrors.name ? "text-red-600" : "text-gray-500"}>
                           {formErrors.name ?? "Usa un nombre corto y fácil de reconocer en el programa."}
                        </span>
                        <span className="text-gray-400">{formData.name.trim().length}/60</span>
                     </div>
                  </div>

                  <div>
                     <label htmlFor="conference-room-description" className="mb-2 block font-medium text-gray-800 text-sm">
                        Descripción
                     </label>
                     <textarea
                        id="conference-room-description"
                        value={formData.description}
                        onChange={(event) => handleChange("description", event.target.value)}
                        placeholder="Añade un contexto breve para esta sala, por ejemplo su enfoque temático o ubicación."
                        rows={6}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           formErrors.description ? "border-red-300" : "border-gray-300"
                        }`}
                     />
                     <div className="mt-2 flex justify-between gap-4 text-xs">
                        <span className={formErrors.description ? "text-red-600" : "text-gray-500"}>
                           {formErrors.description ?? "Opcional. Ayuda a diferenciar salas cuando haya varias conferencias simultáneas."}
                        </span>
                        <span className="text-gray-400">{formData.description.length}/240</span>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                     <Button
                        variant="outline"
                        onClick={() => router.push("/congress-admin/conference-rooms")}
                        disabled={isSaving}
                        className="border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                     >
                        Cancelar
                     </Button>
                     <Button variant="blue" onClick={handleSubmit} disabled={isSaving} loading={isSaving}>
                        {isSaving ? "Guardando..." : mode === "create" ? "Crear sala" : "Guardar cambios"}
                     </Button>
                  </div>
               </div>
            </section>

            <aside className="space-y-6">
               <section className="bg-linear-to-br from-slate-900 to-slate-800 shadow-sm p-6 rounded-2xl text-white">
                  <div className="flex items-center gap-3 mb-5">
                     <div className="flex items-center justify-center rounded-xl bg-white/10 w-11 h-11">
                        <Sparkles className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="font-semibold text-lg">Vista previa</h2>
                        <p className="text-blue-100 text-sm">Así se sentirá esta sala dentro del panel.</p>
                     </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                     <div className="flex items-start justify-between gap-3">
                        <div>
                           <p className="mb-1 text-blue-100 text-xs uppercase tracking-[0.18em]">Sala</p>
                           <h3 className="font-semibold text-xl">
                              {formData.name.trim() || "Nombre de la sala"}
                           </h3>
                        </div>
                        <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-200 text-xs">
                           Lista para usarse
                        </div>
                     </div>
                     <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                        {formData.description.trim() || "La descripción aparecerá aquí para darle más contexto a esta sala."}
                     </p>
                  </div>
               </section>

               <section className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="flex items-center justify-center rounded-xl bg-amber-100 w-11 h-11 text-amber-700">
                        <MessageSquareText className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="font-semibold text-gray-900 text-lg">Buenas prácticas</h2>
                        <p className="text-gray-600 text-sm">Te ayudan a mantener un programa claro y fácil de navegar.</p>
                     </div>
                  </div>

                  <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                     <p>Usa nombres consistentes como “Auditorio A”, “Sala 1” o “Cardio 101” para que los asistentes identifiquen rápidamente dónde ocurre cada sesión.</p>
                     <p>Si varias salas se parecen entre sí, agrega una descripción breve para indicar la temática, ubicación o tipo de audiencia esperada.</p>
                     <p>Cuando conectes las conferencias con salas, una nomenclatura clara hará mucho más fácil mostrar sesiones simultáneas en el lobby y en el panel de administración.</p>
                  </div>
               </section>
            </aside>
         </div>
      </div>
   );
}
