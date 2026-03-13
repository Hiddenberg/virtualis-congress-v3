import ConferenceRoomForm from "@/features/conferenceRooms/components/ConferenceRoomForm";
import { getConferenceRoomById } from "@/features/conferenceRooms/services/conferenceRoomsServices";

export default async function EditConferenceRoomPage({ params }: { params: Promise<{ conferenceRoomId: string }> }) {
   const { conferenceRoomId } = await params;
   const conferenceRoom = await getConferenceRoomById(conferenceRoomId);

   if (!conferenceRoom) {
      return (
         <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h1 className="font-semibold text-lg">Sala no encontrada</h1>
            <p className="mt-2 text-sm">No pudimos encontrar la sala que intentas editar.</p>
         </div>
      );
   }

   return <ConferenceRoomForm mode="edit" conferenceRoom={conferenceRoom} />;
}
