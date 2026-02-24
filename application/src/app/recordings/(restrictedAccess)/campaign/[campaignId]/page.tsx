import {
   AlertCircleIcon,
   ArrowLeftIcon,
   CheckCircleIcon,
   ClockIcon,
   FolderIcon,
   PlayIcon,
   PlusIcon,
   VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/global/Buttons";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import RecordingCard from "@/features/simpleRecordings/components/RecordingCard";
import SendCampaignInvitesButton from "@/features/simpleRecordings/components/SendCampaignInvitesButton";
import {
   getAllCampaignRecordings,
   getRecordingsCampaignById,
} from "@/features/simpleRecordings/services/recordingCampaignsServices";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";

// Campaign Statistics Component
function CampaignStats({ recordings }: { recordings: SimpleRecordingRecord[] }) {
   const totalRecordings = recordings.length;
   const readyRecordings = recordings.filter((r) => r.status === "ready").length;
   const scheduledRecordings = recordings.filter((r) => r.status === "scheduled").length;
   const processingRecordings = recordings.filter(
      (r) => r.status === "recording" || r.status === "uploading" || r.status === "processing",
   ).length;
   const errorRecordings = recordings.filter((r) => r.status === "error").length;

   const completionRate = totalRecordings > 0 ? Math.round((readyRecordings / totalRecordings) * 100) : 0;

   const stats = [
      {
         label: "Total grabaciones",
         value: totalRecordings,
         icon: VideoIcon,
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
      {
         label: "Completadas",
         value: readyRecordings,
         icon: CheckCircleIcon,
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         label: "Programadas",
         value: scheduledRecordings,
         icon: ClockIcon,
         color: "text-yellow-600",
         bgColor: "bg-yellow-50",
      },
      {
         label: "En proceso",
         value: processingRecordings,
         icon: PlayIcon,
         color: "text-purple-600",
         bgColor: "bg-purple-50",
      },
   ];

   if (errorRecordings > 0) {
      stats.push({
         label: "Con errores",
         value: errorRecordings,
         icon: AlertCircleIcon,
         color: "text-red-600",
         bgColor: "bg-red-50",
      });
   }

   return (
      <div className="bg-white shadow-sm mb-8 p-6 border border-gray-200 rounded-xl">
         <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-6">
            {/* Stats Grid */}
            <div className="lg:flex lg:items-center gap-6 grid grid-cols-2">
               {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                     <div className={`${stat.bgColor} p-2 rounded-lg`}>
                        <stat.icon className={`size-5 ${stat.color}`} />
                     </div>
                     <div>
                        <div className="font-semibold text-gray-900 text-lg">{stat.value}</div>
                        <div className="text-gray-500 text-sm">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Progress Section */}
            {totalRecordings > 0 && (
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <div className="font-semibold text-gray-900 text-lg">{completionRate}%</div>
                     <div className="text-gray-500 text-sm">Completado</div>
                  </div>
                  <div className="bg-gray-200 rounded-full w-24 h-3">
                     <div
                        className="bg-linear-to-r from-green-500 to-green-600 rounded-full h-3 transition-all duration-500"
                        style={{
                           width: `${completionRate}%`,
                        }}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

// Empty State Component
function EmptyRecordingsState({ campaignId }: { campaignId: string }) {
   return (
      <div className="bg-white shadow-sm p-12 border border-gray-200 rounded-xl text-center">
         <div className="bg-gray-100 mx-auto mb-4 p-4 rounded-full w-16 h-16">
            <VideoIcon className="size-8 text-gray-400" />
         </div>
         <h3 className="mb-2 font-semibold text-gray-900 text-xl">No hay grabaciones en esta campaña</h3>
         <p className="mx-auto mb-6 max-w-md text-gray-500">
            Comienza agregando tu primera grabación a esta campaña. Puedes crear grabaciones individuales y organizarlas aquí.
         </p>
         <LinkButton
            variant="primary"
            href={`/recordings/campaign/${campaignId}/recordings/create`}
            className="inline-flex items-center gap-2"
         >
            <PlusIcon className="size-4" />
            Crear primera grabación
         </LinkButton>
      </div>
   );
}

export default async function CampaignPage({ params }: { params: Promise<{ campaignId: string }> }) {
   const { campaignId } = await params;

   const organization = await getOrganizationFromSubdomain();
   const campaign = await getRecordingsCampaignById(campaignId);
   const campaignRecordings = await getAllCampaignRecordings(campaignId);

   if (!campaign) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="bg-red-50 p-8 border border-red-200 rounded-xl text-center">
               <div className="bg-red-100 mx-auto mb-4 p-3 rounded-full w-12 h-12">
                  <AlertCircleIcon className="size-6 text-red-600" />
               </div>
               <h1 className="mb-2 font-semibold text-red-900 text-xl">Campaña no encontrada</h1>
               <p className="mb-4 text-red-700">La campaña que estás buscando no existe o no tienes permisos para verla.</p>
               <LinkButton variant="secondary" href="/recordings" className="inline-flex items-center gap-2">
                  <ArrowLeftIcon className="size-4" />
                  Volver a grabaciones
               </LinkButton>
            </div>
         </div>
      );
   }

   const pendingInvites = campaignRecordings.filter(
      (r) => r.invitationEmailStatus === "not_sent" && r.recorderEmail && r.recorderEmail !== "automated@recording.com",
   ).length;

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {/* Breadcrumb Navigation */}
         <div className="mb-6">
            <Link
               href="/recordings"
               className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
               <ArrowLeftIcon className="size-4" />
               Volver a grabaciones
            </Link>
         </div>

         {/* Campaign Header */}
         <div className="flex lg:flex-row flex-col lg:justify-between lg:items-start gap-6 mb-8">
            <div className="flex items-start gap-4">
               <div className="bg-yellow-100 p-3 rounded-xl shrink-0">
                  <FolderIcon className="size-8 text-yellow-600" />
               </div>
               <div>
                  <h1 className="mb-2 font-bold text-gray-900 text-3xl">{campaign.title}</h1>
                  {campaign.description && (
                     <p className="max-w-3xl text-gray-600 text-lg leading-relaxed">{campaign.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                     <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-sm">Campaña de grabación</span>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 shrink-0">
               <LinkButton
                  variant="primary"
                  href={`/recordings/campaign/${campaignId}/recordings/create`}
                  className="inline-flex items-center gap-2"
               >
                  <PlusIcon className="size-4" />
                  Nueva grabación
               </LinkButton>
               {campaignRecordings.length > 0 && (
                  <SendCampaignInvitesButton campaignId={campaignId} pendingCount={pendingInvites} />
               )}
            </div>
         </div>

         {/* Campaign Statistics */}
         <CampaignStats recordings={campaignRecordings} />

         {/* Recordings Section */}
         <div className="mb-6">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl">Grabaciones de la campaña</h2>

            {campaignRecordings.length === 0 ? (
               <EmptyRecordingsState campaignId={campaignId} />
            ) : (
               <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {campaignRecordings.map((recording) => (
                     <RecordingCard key={recording.id} recording={recording} organization={organization} />
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
