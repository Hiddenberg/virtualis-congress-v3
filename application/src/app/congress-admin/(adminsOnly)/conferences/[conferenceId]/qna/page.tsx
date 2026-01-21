import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import AdminQnALinks from "@/features/livestreams/components/AdminQnALinks";
import AdminQnASetup from "@/features/livestreams/components/AdminQnASetup";

export default async function ConferenceQnAAdminPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
         </div>
      );
   }

   const session = await getConferenceQnASession(conferenceId);

   if (!session) {
      return (
         <div className="p-6">
            <div className="mb-6">
               <h1 className="mb-2 font-bold text-gray-900 text-2xl">Sesión de QnA para: {conference.title}</h1>
               <p className="text-gray-600">Decide si deseas habilitar una sesión de preguntas y respuestas.</p>
            </div>
            <AdminQnASetup conferenceId={conferenceId} />
         </div>
      );
   }

   return <AdminQnALinks conferenceId={conferenceId} sessionStatus={session.status} />;
}
