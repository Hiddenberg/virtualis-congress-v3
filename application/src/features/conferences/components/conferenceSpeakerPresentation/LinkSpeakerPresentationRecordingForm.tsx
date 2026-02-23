"use client";

import { CheckCircle2, Link2, ListFilter, Search, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import type {
   SimpleRecording,
   SimpleRecordingCampaignRecord,
   SimpleRecordingRecord,
} from "@/features/simpleRecordings/types/recordingsTypes";
import { linkSpeakerPresentationRecordingAction } from "../../actions/conferenceSpeakerPresentationRecordingActions";

export default function LinkSpeakerPresentationRecordingForm({
   campaigns,
   recordings,
}: {
   campaigns: SimpleRecordingCampaignRecord[];
   recordings: SimpleRecordingRecord[];
}) {
   const [selectedCampaignId, setSelectedCampaignId] = useState<string>("all");
   const [searchQuery, setSearchQuery] = useState<string>("");
   const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
   const [isSubmitting, startTransition] = useTransition();

   const { conferenceId } = useParams<{ conferenceId: string }>();
   const router = useRouter();

   const campaignIdToTitle = useMemo(() => {
      const map: Record<string, string> = {};
      for (const c of campaigns) map[c.id] = c.title;
      return map;
   }, [campaigns]);

   const normalizedQuery = searchQuery.trim().toLowerCase();

   const filteredRecordings = useMemo(() => {
      let list = recordings;
      if (selectedCampaignId !== "all") {
         list = list.filter((r) => r.campaign === selectedCampaignId);
      }
      if (normalizedQuery.length > 0) {
         list = list.filter(
            (r) => r.title.toLowerCase().includes(normalizedQuery) || r.recorderName?.toLowerCase().includes(normalizedQuery),
         );
      }
      // sort: ready first, then by title for nicer UX
      const statusPriority: Record<SimpleRecording["status"], number> = {
         ready: 0,
         processing: 1,
         reviewing: 2,
         uploading: 3,
         recording: 4,
         scheduled: 5,
         error: 6,
      };
      return [...list].sort((a, b) => {
         const byStatus = statusPriority[a.status] - statusPriority[b.status];
         if (byStatus !== 0) return byStatus;
         return a.title.localeCompare(b.title);
      });
   }, [recordings, selectedCampaignId, normalizedQuery]);

   const handleSubmit = () => {
      startTransition(async () => {
         if (!conferenceId || !selectedRecordingId) {
            toast.error("Faltan datos para vincular la grabación de la presentación del ponente");
            return;
         }

         const res = await linkSpeakerPresentationRecordingAction({
            conferenceId,
            recordingId: selectedRecordingId,
         });
         if (!res.success) {
            toast.error(res.errorMessage);
            return;
         }

         toast.success("Grabación de la presentación del ponente vinculada correctamente");
         router.push(`/congress-admin/conferences/${conferenceId}/speaker-presentation-recording`);
      });
   };

   return (
      <div className="mt-4">
         <h2 className="mb-3 font-semibold text-gray-900 text-lg">Selecciona la grabación de la presentación del ponente</h2>

         <div className="bg-white border border-gray-200 rounded-xl">
            {/* Controls */}
            <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3 p-4">
               <div className="flex items-center gap-2 text-gray-700">
                  <ListFilter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Filtra por campaña</span>
               </div>
               <div className="gap-3 md:gap-4 grid grid-cols-1 md:grid-cols-3 w-full">
                  <div className="md:col-span-1">
                     <label htmlFor="campaign-select" className="block mb-1 font-medium text-gray-700 text-sm">
                        Campaña
                     </label>
                     <select
                        id="campaign-select"
                        className="bg-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 text-sm"
                        value={selectedCampaignId}
                        onChange={(e) => {
                           setSelectedCampaignId(e.target.value);
                           setSelectedRecordingId(null);
                        }}
                     >
                        <option value="all">Todas las campañas</option>
                        {campaigns.map((c) => (
                           <option key={c.id} value={c.id}>
                              {c.title}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="md:col-span-2">
                     <label htmlFor="search-recording" className="block mb-1 font-medium text-gray-700 text-sm">
                        Buscar grabación
                     </label>
                     <div className="relative">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-500 -translate-y-1/2" />
                        <input
                           id="search-recording"
                           type="text"
                           className="bg-white py-2 pr-3 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 placeholder:text-gray-400 text-sm"
                           placeholder="Buscar por título o nombre del ponente"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="border-gray-200 border-t" />

            {/* Results header */}
            <div className="flex justify-between items-center px-4 py-3">
               <p className="text-gray-600 text-sm">
                  {filteredRecordings.length} resultado
                  {filteredRecordings.length === 1 ? "" : "s"}
               </p>
               {selectedRecordingId && (
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                     <CheckCircle2 className="w-4 h-4" />
                     <span>1 grabación seleccionada</span>
                  </div>
               )}
            </div>

            {/* List */}
            <div className="px-3 pb-3 max-h-[52vh] overflow-auto">
               {filteredRecordings.length === 0 ? (
                  <div className="flex flex-col justify-center items-center gap-2 py-10 text-gray-500 text-center">
                     <Video className="w-6 h-6" />
                     <p className="text-sm">No se encontraron grabaciones con los filtros actuales</p>
                  </div>
               ) : (
                  <ul className="gap-2 grid grid-cols-1">
                     {filteredRecordings.map((rec) => {
                        const isSelected = selectedRecordingId === rec.id;
                        return (
                           <li key={rec.id}>
                              <button
                                 type="button"
                                 onClick={() => setSelectedRecordingId(rec.id)}
                                 className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
                                    isSelected
                                       ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                                       : "border-gray-200 hover:border-gray-300 bg-white"
                                 }`}
                                 aria-pressed={isSelected}
                              >
                                 <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-1">
                                    <div className="min-w-0">
                                       <p className="font-medium text-gray-900 truncate">{rec.title}</p>
                                       <div className="flex flex-wrap items-center gap-2 text-gray-600 text-xs">
                                          <span>{rec.recorderName}</span>
                                          <span className="hidden sm:inline text-gray-300">•</span>
                                          <span className="truncate">{campaignIdToTitle[rec.campaign] ?? ""}</span>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
                                       <StatusBadge status={rec.status} />
                                       {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                                    </div>
                                 </div>
                              </button>
                           </li>
                        );
                     })}
                  </ul>
               )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 p-4 border-gray-200 border-t">
               <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Link2 className="w-4 h-4" />
                  <span>Vinculará la grabación seleccionada a esta conferencia</span>
               </div>
               <Button variant="blue" onClick={handleSubmit} disabled={!selectedRecordingId} loading={isSubmitting}>
                  Vincular grabación
               </Button>
            </div>
         </div>
      </div>
   );
}

function StatusBadge({ status }: { status: SimpleRecording["status"] }) {
   const styles: Record<SimpleRecording["status"], string> = {
      ready: "bg-green-50 text-green-700 border-green-200",
      processing: "bg-amber-50 text-amber-700 border-amber-200",
      reviewing: "bg-amber-50 text-amber-700 border-amber-200",
      uploading: "bg-blue-50 text-blue-700 border-blue-200",
      recording: "bg-blue-50 text-blue-700 border-blue-200",
      scheduled: "bg-gray-50 text-gray-700 border-gray-200",
      error: "bg-red-50 text-red-700 border-red-200",
   };
   const label: Record<SimpleRecording["status"], string> = {
      ready: "Lista",
      processing: "Procesando",
      reviewing: "En revisión",
      uploading: "Subiendo",
      recording: "Grabando",
      scheduled: "Programada",
      error: "Error",
   };
   return (
      <span
         className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
      >
         {label[status]}
      </span>
   );
}
