import { ArrowLeftIcon, EditIcon } from "lucide-react";
import Link from "next/link";
import EditRecordingForm from "@/features/simpleRecordings/components/EditRecordingForm";
import { getRecordingsCampaignById } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";
export default async function EditRecordingPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="bg-red-50 mx-auto p-8 border border-red-200 rounded-xl max-w-md text-center">
               <h1 className="mb-2 font-semibold text-red-900 text-xl">Grabación no encontrada</h1>
               <p className="mb-4 text-red-700">No se pudo encontrar la grabación especificada.</p>
               <Link
                  href="/recordings"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
               >
                  <ArrowLeftIcon className="size-4" />
                  Volver a grabaciones
               </Link>
            </div>
         </div>
      );
   }

   const campaign = await getRecordingsCampaignById(recording.campaign);

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {/* Breadcrumb Navigation */}
         <div className="mb-6">
            <div className="flex items-center gap-2 text-sm">
               <Link href="/recordings" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Grabaciones
               </Link>
               <span className="text-gray-400">/</span>
               <Link
                  href={`/recordings/campaign/${recording.campaign}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
               >
                  {campaign?.title ?? "Campaña"}
               </Link>
               <span className="text-gray-400">/</span>
               <span className="text-gray-900">Editar grabación</span>
            </div>
         </div>

         {/* Recording Context */}
         <div className="bg-blue-50 mb-8 p-4 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 p-2 rounded-full">
                  <EditIcon className="size-5 text-blue-600" />
               </div>
               <div>
                  <p className="font-medium text-blue-900 text-sm">Editando grabación:</p>
                  <p className="font-semibold text-blue-700">{recording.title}</p>
                  {campaign && (
                     <p className="text-blue-600 text-xs mt-1">
                        Campaña: {campaign.title}
                     </p>
                  )}
               </div>
            </div>
         </div>

         {/* Page Header */}
         <div className="mb-8">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Editar detalles de la grabación</h1>
            <p className="text-gray-600">
               Modifica el título, nombre del grabador, correo electrónico y tipo de grabación según sea necesario.
            </p>
         </div>

         <EditRecordingForm recording={recording} campaignId={recording.campaign} />
      </div>
   );
}
