import { redirect } from "next/navigation";
import UploadConferencePresentation from "@/features/conferences/components/UploadConferencePresentation";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";

export default async function UploadPresentationPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);

   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="mb-2 font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
            <p className="text-gray-600">Verifica que el enlace sea correcto.</p>
         </div>
      );
   }

   const conferencePresentation = await getConferencePresentation(conferenceId);

   if (conferencePresentation) {
      redirect(`/preparation/${conferenceId}/presentation/uploaded`);
   }

   return (
      <div className="p-6">
         <div className="mb-6">
            <h1 className="mb-2 font-bold text-gray-900 text-2xl">Sube la presentación que usarás</h1>
            <p className="text-gray-600">
               Para tu conferencia: <span className="font-semibold text-gray-900">{conference.title}</span>
            </p>
         </div>
         <UploadConferencePresentation conferenceId={conferenceId} />
      </div>
   );
}
