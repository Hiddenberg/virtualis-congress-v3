import { ArrowLeftIcon, FolderIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { getRecordingsCampaignById } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import CreateRecordingForm from "../../../../../../../features/simpleRecordings/components/CreateRecordingForm";

export default async function CreateRecordingPage({
   params,
}: {
   params: Promise<{ campaignId: string }>;
}) {
   const { campaignId } = await params;
   const campaign = await getRecordingsCampaignById(campaignId);

   if (!campaign) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="bg-red-50 mx-auto p-8 border border-red-200 rounded-xl max-w-md text-center">
               <h1 className="mb-2 font-semibold text-red-900 text-xl">
                  Campaña no encontrada
               </h1>
               <p className="mb-4 text-red-700">
                  No se pudo encontrar la campaña especificada.
               </p>
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

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {/* Breadcrumb Navigation */}
         <div className="mb-6">
            <div className="flex items-center gap-2 text-sm">
               <Link
                  href="/recordings"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
               >
                  Grabaciones
               </Link>
               <span className="text-gray-400">/</span>
               <Link
                  href={`/recordings/campaign/${campaignId}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
               >
                  {campaign.title}
               </Link>
               <span className="text-gray-400">/</span>
               <span className="text-gray-900">Nueva grabación</span>
            </div>
         </div>

         {/* Campaign Context */}
         <div className="bg-blue-50 mb-8 p-4 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 p-2 rounded-full">
                  <FolderIcon className="size-5 text-blue-600" />
               </div>
               <div>
                  <p className="font-medium text-blue-900 text-sm">
                     Creando grabación en la campaña:
                  </p>
                  <p className="font-semibold text-blue-700">
                     {campaign.title}
                  </p>
               </div>
            </div>
         </div>

         {/* Page Header */}
         <div className="mb-8 text-center">
            <div className="bg-yellow-100 mx-auto mb-4 p-3 rounded-full w-16 h-16">
               <VideoIcon className="size-10 text-yellow-600" />
            </div>
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">
               Programar nueva grabación
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg">
               Completa la información para programar una nueva grabación. Se
               enviará una invitación al grabador con las instrucciones.
            </p>
         </div>

         <CreateRecordingForm campaignId={campaignId} />
      </div>
   );
}
