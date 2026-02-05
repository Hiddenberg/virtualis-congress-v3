import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import DynamicZoomCallInterface from "@/features/livestreams/components/DynamicZoomCallInterface";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import RealtimeProjectionRefresher from "@/features/projectionScreen/components/RealtimeProjectionRefresher";

export default async function CongressDirectorCameraCallPage() {
   const congress = await getLatestCongress();
   const { activeConference } = await getActiveAndNextConferences();
   if (!activeConference) {
      return (
         <div>
            <RealtimeProjectionRefresher congressId={congress.id} />
            <span className="text-gray-500 text-sm">No hay conferencia activa</span>
         </div>
      );
   }

   const livestreamSession = await getConferenceLivestreamSession(activeConference.id);

   if (!livestreamSession) {
      return (
         <div>
            <RealtimeProjectionRefresher congressId={congress.id} />
            <span className="text-gray-500 text-sm">
               No se encontró la sesión de transmisión para la conferencia {activeConference.id}
            </span>
         </div>
      );
   }

   return (
      <div className="w-full">
         <RealtimeProjectionRefresher congressId={congress.id} />
         <h1>Llamada de cámara para {activeConference.title}</h1>

         <ZoomSessionProvider sessionName={`${activeConference.title}-conf`} sessionKey={livestreamSession.id}>
            <DynamicZoomCallInterface initialUsername="Dispositivo camara" className="w-full" isHostByDefault={true} />
         </ZoomSessionProvider>
      </div>
   );
}
