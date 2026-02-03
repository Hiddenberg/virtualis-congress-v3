import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import ZoomCallInterface from "@/features/livestreams/components/ZoomCallInterface";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";

export default async function CongressDirectorCameraCallPage() {
   const { activeConference } = await getActiveAndNextConferences();
   if (!activeConference) {
      return <div>No hay conferencia activa</div>;
   }

   const livestreamSession = await getConferenceLivestreamSession(activeConference.id);

   if (!livestreamSession) {
      return <div>No se encontró la sesión de transmisión para la conferencia {activeConference.id}</div>;
   }

   return (
      <div className="w-full">
         <h1>Llamada de cámara para {activeConference.title}</h1>

         <ZoomSessionProvider sessionName={`${activeConference.title}-conf`} sessionKey={livestreamSession.id}>
            <ZoomCallInterface initialUsername="Pantalla Proyección" className="w-full" />
         </ZoomSessionProvider>
      </div>
   );
}
