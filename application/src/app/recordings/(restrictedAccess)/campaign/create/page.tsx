import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import CreateRecordingCampaignForm from "@/features/simpleRecordings/components/CreateRecordingCampaignForm";

export default function CreateCampaignPage() {
   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {/* Breadcrumb Navigation */}
         <div className="mb-8">
            <Link
               href="/recordings"
               className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
               <ArrowLeftIcon className="size-4" />
               Volver a grabaciones
            </Link>
         </div>

         {/* Page Header */}
         <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Crear campaña de grabación</h1>
            <p className="text-gray-600 text-lg">Organiza tus grabaciones en campañas para una mejor gestión</p>
         </div>

         <CreateRecordingCampaignForm />
      </div>
   );
}
