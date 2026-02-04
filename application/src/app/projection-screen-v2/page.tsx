import ConferenceCountdown from "@/features/conferences/components/ConferenceCountdown";
import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonStateServices";
import DynamicZoomCallInterface from "@/features/livestreams/components/DynamicZoomCallInterface";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import FixedScaleStage from "@/features/projectionScreen/components/FixedScaleStage";
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
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3 *:bg-white *:rounded-lg *:w-auto *:h-28 *:object-contain">
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
               <div className="flex flex-col gap-4 col-span-12">
                  {/* presentation and video player */}
                  <div
                     className="flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                     style={{
                        height: 600,
                     }}
                  >
                     {/* <span className="font-medium text-white/90 text-lg md:text-xl">Presentación / Video</span> */}
                     <ZoomSessionProvider sessionName={`${activeConference.title}-conf`} sessionKey={livestreamSession.id}>
                        <DynamicZoomCallInterface initialUsername="Pantalla Proyección" className="-mt-10! w-full" />
                     </ZoomSessionProvider>
                  </div>

                  {/* conference title */}
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                     {activeConference.title}
                  </div>

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
            </div>
         </FixedScaleStage>
      </div>
   );
}
