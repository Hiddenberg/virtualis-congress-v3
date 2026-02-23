"use client";

import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
   linkRecordingToConferenceAction,
   unlinkRecordingFromConferenceAction,
} from "@/features/conferences/actions/conferenceRecordingActions";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";

interface Props {
   conferenceId: CongressConferenceRecord["id"];
   allRecordings: SimpleRecordingRecord[];
   initialSelectedIds: string[];
}

export default function RecordingsSelector({ conferenceId, allRecordings, initialSelectedIds }: Props) {
   const router = useRouter();
   const [selectedId, setSelectedId] = useState<string | null>(initialSelectedIds[0] ?? null);
   const [query, setQuery] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSelect = (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id));
   };

   const selectedInitial = initialSelectedIds[0] ?? null;
   const toLink = selectedId && selectedId !== selectedInitial ? selectedId : null;
   const toUnlink = selectedInitial && (!selectedId || selectedId !== selectedInitial) ? selectedInitial : null;

   const filteredRecordings = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return allRecordings;
      return allRecordings.filter(
         (r) =>
            r.title.toLowerCase().includes(q) ||
            r.recorderName?.toLowerCase().includes(q) ||
            r.recorderEmail?.toLowerCase().includes(q),
      );
   }, [allRecordings, query]);

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

   return (
      <div>
         <div className="mb-3">
            <input
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Buscar por título, nombre o correo"
               className="px-3 py-2 rounded-md outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
         </div>
         <div className="space-y-2 pr-1 max-h-80 overflow-auto">
            {filteredRecordings.length === 0 ? (
               <p className="text-gray-600">No hay grabaciones disponibles.</p>
            ) : (
               filteredRecordings.map((rec) => (
                  <label
                     key={rec.id}
                     className="flex justify-between items-center gap-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                  >
                     <div className="min-w-0">
                        <p className="text-gray-900 text-sm truncate">{rec.title}</p>
                        <p className="text-gray-500 text-xs truncate">
                           {rec.recorderName} • {rec.status}
                        </p>
                     </div>
                     <input
                        type="radio"
                        name="selectedRecording"
                        className="size-4"
                        checked={selectedId === rec.id}
                        onChange={() => handleSelect(rec.id)}
                     />
                  </label>
               ))
            )}
         </div>
         <div className="flex justify-end mt-4">
            <button
               type="button"
               onClick={handleSave}
               disabled={isSubmitting || (!toLink && !toUnlink)}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 px-4 py-2 rounded-md text-white text-sm"
            >
               {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
         </div>
      </div>
   );
}
