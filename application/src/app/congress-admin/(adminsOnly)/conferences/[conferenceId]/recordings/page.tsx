import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RecordingsManager from "@/features/conferences/components/recordings/RecordingsManager";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";

export default async function AdminConferenceRecordingsPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
            <Link href="/congress-admin/conferences" className="inline-flex items-center gap-2 mt-4 text-blue-700 text-sm">
               <ArrowLeft className="w-4 h-4" /> Volver a conferencias
            </Link>
         </div>
      );
   }

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h1 className="mb-2 font-bold text-gray-900 text-2xl">Grabación de la conferencia</h1>
               <p className="text-gray-600">{conference.title}</p>
            </div>
            <Link href="/congress-admin/conferences" className="inline-flex items-center gap-2 text-blue-700 text-sm">
               <ArrowLeft className="w-4 h-4" /> Volver a conferencias
            </Link>
         </div>
         <RecordingsManager conferenceId={conferenceId} />
      </div>
   );
}
