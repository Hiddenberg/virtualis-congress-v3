import { ArrowLeftIcon, LinkIcon } from "lucide-react";
import { CopyButton, LinkButton } from "@/components/global/Buttons";
import { PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import AdminPresentationManager from "@/features/conferences/components/presentation/AdminPresentationManager";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import PresentationViewer from "@/features/pptPresentations/components/PresentationShower";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";

export default async function ConferencePresentationAdminPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
         </div>
      );
   }

   const presentation = await getConferencePresentation(conferenceId);
   const organization = await getOrganizationFromSubdomain();
   const uploadLinkHost = `${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/preparation/${conferenceId}/presentation/upload`;
   const uploadLink = `//${uploadLinkHost}`;

   const presentationSlides = await getPresentationSlidesById(presentation?.id ?? "");

   return (
      <div className="p-6">
         {/* add a back button */}
         <LinkButton href={`/congress-admin/conferences`} variant="outline">
            <ArrowLeftIcon className="w-4 h-4" />
            Volver a la conferencia
         </LinkButton>

         <div className="mb-6">
            <h1 className="mb-2 font-bold text-gray-900 text-2xl">Presentación de la conferencia</h1>
            <p className="text-gray-600">{conference.title}</p>
         </div>

         {/* Reuse same sub-card visual for upload link if none */}
         {!presentation && (
            <div className="bg-white shadow-sm mb-4 p-4 border border-gray-200 rounded-lg">
               <p className="text-gray-700">El ponente no ha subido su presentación</p>
               <div className="flex justify-between items-center gap-3 bg-white mt-3 px-3 py-2 rounded-md ring-1 ring-gray-200">
                  <div className="flex items-center gap-2 min-w-0">
                     <LinkIcon className="w-4 h-4 text-gray-500 shrink-0" />
                     <a
                        href={uploadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 text-sm hover:underline truncate"
                     >
                        {uploadLinkHost}
                     </a>
                  </div>
                  <CopyButton text={uploadLinkHost} />
               </div>
               <p className="mt-1 text-gray-500 text-xs">
                  Comparte este link con el participante para que pueda subir su presentación
               </p>
            </div>
         )}

         <AdminPresentationManager conferenceId={conferenceId} presentation={presentation || undefined} />

         {presentationSlides.length > 0 && <PresentationViewer presentationSlides={presentationSlides} />}
      </div>
   );
}
