import { QrCodeIcon } from "lucide-react";
import SelfContainedRealtimeChatViewer from "@/features/chats/components/SelfContainedRealtimeChatViewer";
import ConferenceCountdown from "@/features/conferences/components/ConferenceCountdown";
import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonState";
import ZoomCallInterface from "@/features/livestreams/components/ZoomCallInterface";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import FixedScaleStage from "@/features/projectionScreen/components/FixedScaleStage";
import LobbyQrCodeWidget from "@/features/projectionScreen/components/LobbyQrCodeWidget";
import StandbyScreen from "@/features/projectionScreen/components/StandbyScreen";

export default async function ProjectionScreenPage() {
   const congressInPersonState = await ensuredCongressInPersonState();
   const [congress, organization, { nextConference, activeConference }] = await Promise.all([
      getLatestCongress(),
      getOrganizationFromSubdomain(),
      getActiveAndNextConferences(),
   ]);

   if (congressInPersonState.status === "standby" || !congressInPersonState.activeConference) {
      return <StandbyScreen nextConference={nextConference} organization={organization} congress={congress} />;
   }

   if (!activeConference) {
      return (
         <div>
            <h1>No se encontró la conferencia activa</h1>
         </div>
      );
   }

   const livestreamSession = await getConferenceLivestreamSession(activeConference.id);

   if (!livestreamSession) {
      return (
         <div>
            <h1>No se encontró la sesión de transmisión para la conferencia {activeConference.id}</h1>
         </div>
      );
   }

   return (
      <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
         <FixedScaleStage baseWidth={1400} baseHeight={880} className="mx-auto">
            {/* header */}
            <div
               className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
               style={{
                  maxWidth: 1400,
               }}
            >
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3 *:h-28 *:w-auto *:object-contain *:rounded-lg *:bg-white">
                  <img src={organization.logoURL ?? ""} alt={`${organization.name} logo`} />
               </div>
               <div className="col-span-12 md:col-span-6">
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                     {congress?.title}
                  </div>
               </div>
               <div className="col-span-12 md:col-span-3">
                  <ConferenceCountdown conference={activeConference} />
               </div>
            </div>

            {/* main content */}
            <div
               className="gap-4 grid grid-cols-12 mx-auto"
               style={{
                  maxWidth: 1400,
               }}
            >
               {/* left side */}
               <div className="flex flex-col gap-4 col-span-12 md:col-span-8">
                  {/* presentation and video player */}
                  <div
                     className="flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                     style={{
                        height: 520,
                     }}
                  >
                     {/* <span className="font-medium text-white/90 text-lg md:text-xl">Presentación / Video</span> */}
                     <ZoomSessionProvider sessionName={`${activeConference.title}-conf`} sessionKey={livestreamSession.id}>
                        <ZoomCallInterface initialUsername="Pantalla Proyección" className="w-full" />
                     </ZoomSessionProvider>
                  </div>

                  {/* conference title */}
                  {/* <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{conference?.title}</div> */}

                  {/* bottom widgets */}
                  {/* <div className="gap-4 grid grid-cols-2">
                     <SelfContainedRealtimeQuestionPollCompactDisplay conferenceId={activeConferenceId} />
                     <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800"></div>
                     <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                        <LobbyQrCodeWidget />
                     </div>
                  </div> */}
               </div>

               {/* right side */}
               <div className="flex flex-col gap-4 col-span-4">
                  {/* camera + speaker */}
                  {/* <div className="flex flex-col gap-3 bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl"
                     style={{
                        height: 320
                     }}
                  >
                     <div className="flex justify-center items-center bg-blue-50/80 shadow-sm border border-slate-300 rounded-xl h-10 font-semibold text-slate-800 text-sm">{conferenceSpeaker?.displayName}</div>
                     <div className="flex flex-1 justify-center items-center bg-black/30 border border-slate-300 rounded-xl text-white/90">
                        <RealtimeCameraComponent />
                     </div>
                  </div> */}

                  <div className="bg-white shadow-xl p-6 border border-slate-200/60 rounded-3xl">
                     <div className="space-y-4 text-center">
                        <div className="flex justify-center items-center gap-2 mb-4">
                           <QrCodeIcon className="w-5 h-5 text-blue-600" />
                           <h3 className="font-bold text-slate-900 text-lg">Accede a la plataforma</h3>
                        </div>

                        <div className="flex justify-center">
                           <LobbyQrCodeWidget />
                        </div>

                        <div className="bg-blue-50 px-4 py-3 rounded-xl">
                           <p className="font-medium text-blue-800 text-sm">
                              Escanea el código QR para participar desde tu dispositivo
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* chat */}
                  {/* If there's a full chat component, render it here, else keep placeholder with fixed height */}
                  <div
                     className="flex justify-center bg-white/70 shadow-sm border border-slate-300 rounded-2xl font-medium text-slate-800"
                     style={{
                        height: 420,
                     }}
                  >
                     <SelfContainedRealtimeChatViewer conferenceId={activeConference.id} />
                  </div>
               </div>
            </div>
         </FixedScaleStage>
      </div>
   );
}
