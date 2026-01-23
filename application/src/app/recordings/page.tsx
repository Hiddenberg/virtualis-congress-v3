import {
   ArrowRightIcon,
   CheckCircleIcon,
   ClockIcon,
   FolderIcon,
   PlayIcon,
   PlusIcon,
   VideoIcon,
   // TrendingUpIcon
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import GoBackButton from "@/components/global/GoBackButton";
import { getAllSimpleRecordingCampaigns } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { getAllSimpleRecordings } from "@/features/simpleRecordings/services/recordingsServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkUserAuthorization, getUserById } from "@/features/users/services/userServices";

// Campaign Card Component
function CampaignCard({
   campaign,
   recordingsCount,
   completedCount,
   pendingCount,
}: {
   campaign: SimpleRecordingCampaign & { id: string };
   recordingsCount: number;
   completedCount: number;
   pendingCount: number;
}) {
   return (
      <Link
         href={`/recordings/campaign/${campaign.id}`}
         className="group block bg-white hover:bg-gray-50 shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl hover:scale-[1.02] transition-all duration-200"
      >
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 p-3 rounded-xl">
                  <VideoIcon className="size-6 text-blue-600" />
               </div>
               <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-lg transition-colors">
                     {campaign.title}
                  </h3>
                  <p className="text-gray-500 text-sm">Campaña de grabación</p>
               </div>
            </div>
            <ArrowRightIcon className="size-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
         </div>

         <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <PlayIcon className="size-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">
                     {recordingsCount} {recordingsCount === 1 ? "Grabación" : "Grabaciones"}
                  </span>
               </div>
               {recordingsCount > 0 && (
                  <div className="flex items-center gap-2">
                     <CheckCircleIcon className="size-4 text-green-500" />
                     <span className="text-gray-600 text-sm">{completedCount} Completadas</span>
                  </div>
               )}
               {recordingsCount > 0 && (
                  <div className="flex items-center gap-2">
                     <ClockIcon className="size-4 text-yellow-600" />
                     <span className="text-gray-600 text-sm">{pendingCount} Pendinetes</span>
                  </div>
               )}
            </div>

            {/* <CampaignStatusBadge recordingsCount={recordingsCount} completedCount={completedCount} /> */}
         </div>

         {recordingsCount > 0 && (
            <div className="mt-4">
               <div className="bg-gray-200 rounded-full h-2">
                  <div
                     className="bg-green-500 rounded-full h-2 transition-all duration-300"
                     style={{
                        width: `${recordingsCount > 0 ? Math.round((completedCount / recordingsCount) * 100) : 0}%`,
                     }}
                  />
               </div>
            </div>
         )}
      </Link>
   );
}

// Empty State Component
function EmptyState() {
   return (
      <div className="flex flex-col justify-center items-center bg-white shadow-sm p-12 border border-gray-200 rounded-xl text-center">
         <div className="bg-gray-100 mb-4 p-4 rounded-full">
            <VideoIcon className="size-8 text-gray-400" />
         </div>
         <h3 className="mb-2 font-semibold text-gray-900 text-lg">No hay campañas de grabación</h3>
         <p className="mb-6 max-w-md text-gray-500">
            Aún no se han creado campañas de grabación. Las campañas te permiten organizar y gestionar múltiples grabaciones de
            manera eficiente.
         </p>
         <LinkButton variant="blue" href="/recordings/campaign/create">
            <PlusIcon className="size-4" />
            Crear primera campaña
         </LinkButton>
      </div>
   );
}

// Header Component
function PageHeader({ campaignsCount }: { campaignsCount: number }) {
   return (
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Campañas de Grabación</h1>
            <p className="text-gray-600">
               Gestiona y organiza tus grabaciones por campañas
               {campaignsCount > 0 && (
                  <span className="ml-2 text-gray-500">
                     • {campaignsCount} {campaignsCount === 1 ? "campaña" : "campañas"}
                  </span>
               )}
            </p>
         </div>

         {campaignsCount > 0 && (
            <LinkButton href="/recordings/campaign/create">
               <PlusIcon className="size-4" />
               Nueva campaña
            </LinkButton>
         )}
      </div>
   );
}

// Overview Stats Component
function CampaignOverview({
   campaigns,
   allRecordings,
}: {
   campaigns: (SimpleRecordingCampaign & { id: string })[];
   allRecordings: SimpleRecording[];
}) {
   const totalRecordings = allRecordings.length;
   const completedRecordings = allRecordings.filter((r) => r.status === "ready").length;
   const pendingRecordings = allRecordings.filter((r) => r.status !== "ready").length;
   const completionRate = totalRecordings > 0 ? Math.round((completedRecordings / totalRecordings) * 100) : 0;

   const stats = [
      {
         label: "Campañas",
         value: campaigns.length,
         icon: FolderIcon,
         color: "text-purple-600",
         bgColor: "bg-purple-50",
      },
      {
         label: "Total grabaciones",
         value: totalRecordings,
         icon: VideoIcon,
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
      {
         label: "Completadas",
         value: completedRecordings,
         icon: CheckCircleIcon,
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         label: "Pendientes",
         value: pendingRecordings,
         icon: ClockIcon,
         color: "text-yellow-600",
         bgColor: "bg-yellow-50",
      },
   ];

   if (campaigns.length === 0) {
      return null;
   }

   return (
      <div className="bg-white shadow-sm mb-8 p-6 border border-gray-200 rounded-xl">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
               {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                     <div className={`${stat.bgColor} p-2 rounded-lg`}>
                        <stat.icon className={`size-5 ${stat.color}`} />
                     </div>
                     <div>
                        <div className="font-medium text-gray-900 text-sm">{stat.value}</div>
                        <div className="text-gray-500 text-xs">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </div>

            {totalRecordings > 0 && (
               <div className="flex items-center gap-3">
                  <div className="text-right">
                     <div className="font-medium text-gray-900 text-sm">{completionRate}% completado</div>
                     <div className="text-gray-500 text-xs">
                        {completedRecordings} de {totalRecordings}
                     </div>
                  </div>
                  <div className="bg-gray-200 rounded-full w-32 h-2">
                     <div
                        className="bg-green-500 rounded-full h-2 transition-all duration-300"
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

export default async function RecordingsPage() {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user) {
      return redirect("/login/?redirectTo=/recordings");
   }

   const isUserAuthorized = await checkUserAuthorization(user.id, ["super_admin", "admin", "coordinator"]);
   if (!isUserAuthorized) {
      return redirect("/unauthorized?route=/recordings");
   }

   const allRecordings = await getAllSimpleRecordings();
   const allRecordingCampaigns = await getAllSimpleRecordingCampaigns();

   // Calculate recordings count per campaign
   const campaignsWithStats = allRecordingCampaigns.map((campaign) => {
      const campaignRecordings = allRecordings.filter((recording) => recording.campaign === campaign.id);
      const completedRecordings = campaignRecordings.filter((recording) => recording.status === "ready");
      const pendingRecordings = campaignRecordings.filter((recording) => recording.status !== "ready");

      return {
         ...campaign,
         recordingsCount: campaignRecordings.length,
         completedCount: completedRecordings.length,
         pendingCount: pendingRecordings.length,
      };
   });

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {(user.role === "admin" || user.role === "super_admin") && (
            <div className="mb-8">
               <GoBackButton />
            </div>
         )}

         <PageHeader campaignsCount={allRecordingCampaigns.length} />

         <CampaignOverview campaigns={allRecordingCampaigns} allRecordings={allRecordings} />

         {allRecordingCampaigns.length === 0 ? (
            <EmptyState />
         ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {campaignsWithStats.map((campaign) => (
                  <CampaignCard
                     key={campaign.id}
                     campaign={campaign}
                     recordingsCount={campaign.recordingsCount}
                     completedCount={campaign.completedCount}
                     pendingCount={campaign.pendingCount}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
