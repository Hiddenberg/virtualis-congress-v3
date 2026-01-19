"use client";

import { FileVideo2Icon, FolderIcon, SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
   linkRecordingToConferenceAction,
   unlinkRecordingFromConferenceAction,
} from "@/features/conferences/actions/conferenceRecordingActions";

interface Props {
   conferenceId: CongressConferenceRecord["id"];
   campaigns: SimpleRecordingCampaignRecord[];
   recordingsByCampaign: Record<string, SimpleRecordingRecord[]>;
   initiallyLinkedRecordingId?: string;
}

export default function CampaignRecordingsLinker({
   conferenceId,
   campaigns,
   recordingsByCampaign,
   initiallyLinkedRecordingId,
}: Props) {
   const router = useRouter();

   const [activeCampaignId, setActiveCampaignId] = useState<string>(
      campaigns[0]?.id || "",
   );
   const [query, setQuery] = useState("");
   const [selectedId, setSelectedId] = useState<string | null>(
      initiallyLinkedRecordingId || null,
   );
   const [isSubmitting, setIsSubmitting] = useState(false);

   const idToRecording = useMemo(() => {
      const map: Record<string, SimpleRecordingRecord> = {};
      Object.values(recordingsByCampaign).forEach((list) => {
         list.forEach((r) => {
            map[r.id] = r;
         });
      });
      return map;
   }, [recordingsByCampaign]);

   const activeRecordings = useMemo(
      () => recordingsByCampaign[activeCampaignId] || [],
      [recordingsByCampaign, activeCampaignId],
   );

   const filteredRecordings = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return activeRecordings;
      return activeRecordings.filter(
         (r) =>
            r.title.toLowerCase().includes(q) ||
            r.recorderName.toLowerCase().includes(q) ||
            r.recorderEmail.toLowerCase().includes(q),
      );
   }, [activeRecordings, query]);

   const initial = initiallyLinkedRecordingId || null;
   const toLink = selectedId && selectedId !== initial ? selectedId : null;
   const toUnlink =
      initial && (!selectedId || selectedId !== initial) ? initial : null;

   const assignedRecording = initial ? idToRecording[initial] : undefined;
   const assignedCampaignTitle = assignedRecording
      ? campaigns.find((c) => c.id === assignedRecording.campaign)?.title
      : undefined;

   const handleSave = async () => {
      setIsSubmitting(true);
      try {
         if (toLink) {
            const res = await linkRecordingToConferenceAction({
               conferenceId,
               recordingId: toLink,
            });
            if (!res.success) throw new Error(res.errorMessage);
         }
         if (toUnlink) {
            const res = await unlinkRecordingFromConferenceAction({
               conferenceId,
               recordingId: toUnlink,
            });
            if (!res.success) throw new Error(res.errorMessage);
         }
         toast.success("Cambios guardados");
         startTransition(() => router.refresh());
      } catch (e) {
         const err = e as Error;
         toast.error(err.message || "Error al guardar");
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleUnassign = async () => {
      if (!initial) return;
      const confirmed = window.confirm("¿Quitar la grabación asignada?");
      if (!confirmed) return;
      setIsSubmitting(true);
      try {
         const res = await unlinkRecordingFromConferenceAction({
            conferenceId,
            recordingId: initial,
         });
         if (!res.success) throw new Error(res.errorMessage);
         toast.success("Grabación desvinculada");
         setSelectedId(null);
         startTransition(() => router.refresh());
      } catch (e) {
         const err = e as Error;
         toast.error(err.message || "No se pudo desvincular");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
         <aside className="lg:col-span-1 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 font-semibold text-gray-900 text-sm">
               Campañas
            </h3>
            <nav className="space-y-1">
               {campaigns.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                     No hay campañas de grabación.
                  </p>
               ) : (
                  campaigns.map((c) => (
                     <button
                        key={c.id}
                        onClick={() => setActiveCampaignId(c.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCampaignId === c.id ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "hover:bg-gray-50 text-gray-700"}`}
                     >
                        <span className="inline-flex items-center gap-2">
                           <FolderIcon className="w-4 h-4" />
                           <span className="truncate">{c.title}</span>
                        </span>
                     </button>
                  ))
               )}
            </nav>
         </aside>

         <section className="lg:col-span-2 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            {/* Assigned recording highlight */}
            <div className="mb-4">
               {assignedRecording ? (
                  <div className="flex justify-between items-start gap-4 bg-green-50 px-4 py-3 rounded-lg ring-1 ring-green-200">
                     <div>
                        <span className="font-semibold text-green-800">
                           Grabación asignada
                        </span>
                        <div className="flex items-start gap-3 min-w-0">
                           <div className="bg-green-100 p-2 rounded-md shrink-0">
                              <FileVideo2Icon className="w-5 h-5 text-green-700" />
                           </div>
                           <div className="min-w-0">
                              <p className="font-medium text-green-900 text-sm truncate">
                                 {assignedRecording.title}
                              </p>
                              <p className="text-green-800 text-xs truncate">
                                 {assignedCampaignTitle || "Sin campaña"} •{" "}
                                 {assignedRecording.status}
                              </p>
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={handleUnassign}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md ring-1 ring-red-200 text-red-700 text-xs"
                     >
                        <XIcon className="w-4 h-4" /> Quitar asignación
                     </button>
                  </div>
               ) : (
                  <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-lg ring-1 ring-amber-200">
                     <FileVideo2Icon className="w-5 h-5 text-amber-700" />
                     <div className="min-w-0">
                        <p className="font-medium text-amber-900 text-sm">
                           Sin grabación asignada
                        </p>
                        <p className="text-amber-800 text-xs">
                           Selecciona una grabación de la lista para asignarla.
                        </p>
                     </div>
                  </div>
               )}
            </div>

            <div className="flex justify-between items-center gap-2 mb-4">
               <div className="relative grow">
                  <SearchIcon className="top-2.5 left-2 absolute w-4 h-4 text-gray-500" />
                  <input
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Buscar por título, nombre o correo"
                     className="px-3 py-2 pl-8 rounded-md outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 w-full text-sm"
                  />
               </div>
               {/* <div className="hidden md:flex items-center gap-2 text-gray-500 text-xs">
                  <span>Seleccionada:</span>
                  {selectedId ? (
                     <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2Icon className="w-4 h-4" /> {selectedId}</span>
                  ) : (
                     <span className="text-gray-400">ninguna</span>
                  )}
               </div> */}
            </div>

            {filteredRecordings.length === 0 ? (
               <div className="flex flex-col justify-center items-center gap-2 py-10 text-center">
                  <FileVideo2Icon className="w-8 h-8 text-gray-300" />
                  <p className="text-gray-600 text-sm">
                     No hay grabaciones en esta campaña.
                  </p>
               </div>
            ) : (
               <ul className="divide-y divide-gray-100">
                  {filteredRecordings.map((rec) => (
                     <li
                        key={rec.id}
                        className="flex justify-between items-center gap-3 py-2"
                     >
                        <div className="min-w-0">
                           <p className="text-gray-900 text-sm truncate">
                              {rec.title}
                           </p>
                           <p className="text-gray-500 text-xs truncate">
                              {rec.recorderName} • {rec.status}
                           </p>
                           <p className="text-gray-500 text-xs truncate">
                              {rec.durationSeconds.toFixed(2)} segundos
                           </p>
                        </div>
                        <label className="inline-flex items-center gap-2">
                           <input
                              type="radio"
                              name="selectedRecording"
                              className="size-4"
                              checked={selectedId === rec.id}
                              onChange={() => setSelectedId(rec.id)}
                           />
                           <span className="text-sm">Seleccionar</span>
                        </label>
                     </li>
                  ))}
               </ul>
            )}

            <div className="flex justify-end mt-4">
               <button
                  onClick={handleSave}
                  disabled={isSubmitting || (!toLink && !toUnlink)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 px-4 py-2 rounded-md text-white text-sm"
               >
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
               </button>
            </div>
         </section>
      </div>
   );
}
