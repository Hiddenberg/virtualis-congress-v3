import { ensureConferenceLivestream } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import AdminLivestreamLinks from "@/features/livestreams/components/AdminLivestreamLinks";

export default async function ConferenceLivestreamAdminPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">
               Conferencia no encontrada
            </h1>
         </div>
      );
   }

   const livestreamSession = await ensureConferenceLivestream(conferenceId);

   return (
      <AdminLivestreamLinks
         conferenceId={conferenceId}
         livestreamSessionStatus={
            livestreamSession.status as
               | "scheduled"
               | "preparing"
               | "streaming"
               | "ended"
         }
      />
   );
}
