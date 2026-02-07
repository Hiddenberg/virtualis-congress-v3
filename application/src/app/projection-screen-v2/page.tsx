import ConferenceCountdown from "@/features/conferences/components/ConferenceCountdown";
import ConferenceTimeBanner from "@/features/conferences/components/ConferenceTimeBanner";
import { ConferenceCountdownProvider } from "@/features/conferences/contexts/ConferenceCountdownContext";
import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonStateServices";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import DynamicProjectionScreenCallInterface from "@/features/projectionScreen/components/DynamicProjectionScreenCallInterface";
import FixedScaleStage from "@/features/projectionScreen/components/FixedScaleStage";
import RealtimeProjectionRefresher from "@/features/projectionScreen/components/RealtimeProjectionRefresher";
import StandbyScreen from "@/features/projectionScreen/components/StandbyScreen";
import type { SpeakerDataRecord } from "@/types/congress";

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

   const [livestreamSession, conferenceSpeakers] = await Promise.all([
      getConferenceLivestreamSession(activeConference.id),
      getConferenceSpeakers(activeConference.id),
   ]);

   if (!livestreamSession) {
      return (
         <div>
            <h1>No se encontró la sesión de transmisión para la conferencia {activeConference.id}</h1>
         </div>
      );
   }

   const BASE_WIDTH = 1400;
   const BASE_HEIGHT = 900;

   return (
      <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
         <RealtimeProjectionRefresher congressId={congress.id} />
         <FixedScaleStage baseWidth={BASE_WIDTH} baseHeight={BASE_HEIGHT} className="mx-auto">
            {/* header */}
            {/* <div
               className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
               style={{
                  maxWidth: BASE_WIDTH,
               }}
            >
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3 *:bg-white *:rounded-lg *:w-auto *:h-24 *:object-contain">
                  <img src={organization.logoURL ?? ""} alt={`${organization.name} logo`} />
               </div>
               <div className="flex justify-center items-center col-span-12 md:col-span-6 bg-blue-50/70 shadow-sm p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 text-lg text-center">
                  {congress?.title}
               </div>
               <div className="col-span-12 md:col-span-3">
                  <ConferenceCountdown conference={activeConference} />
               </div>
            </div> */}

            {/* main content */}
            <ConferenceCountdownProvider>
               <div
                  className="gap-4 grid grid-cols-12 mx-auto"
                  style={{
                     maxWidth: BASE_WIDTH,
                  }}
               >
                  {/* left side */}
                  <div className="flex flex-col gap-4 col-span-12">
                     {/* presentation and video player */}
                     <div
                        className="relative flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                        style={{
                           height: 750,
                        }}
                     >
                        <ConferenceTimeBanner />
                        <ZoomSessionProvider sessionName={`${activeConference.title}-conf`} sessionKey={livestreamSession.id}>
                           <DynamicProjectionScreenCallInterface initialUsername="Pantalla Proyección" className="w-full" />
                        </ZoomSessionProvider>
                     </div>

                     <div className="gap-4 grid grid-cols-12">
                        <div className="space-y-2 col-span-12 md:col-span-8">
                           {/* conference title */}
                           <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                              {activeConference.title}
                           </div>

                           {/* speaker name */}
                           {conferenceSpeakers.length > 0 && (
                              <div className="flex justify-center items-center bg-slate-50/70 shadow-sm border border-slate-300 rounded-xl h-10 font-medium text-slate-700 text-base">
                                 {conferenceSpeakers
                                    .map((speaker: SpeakerDataRecord) =>
                                       speaker.academicTitle
                                          ? `${speaker.academicTitle} ${speaker.displayName}`
                                          : speaker.displayName,
                                    )
                                    .join(", ")}
                              </div>
                           )}
                        </div>

                        <div className="col-span-12 md:col-span-4">
                           <ConferenceCountdown conference={activeConference} />
                        </div>
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
               </div>
            </ConferenceCountdownProvider>
         </FixedScaleStage>
      </div>
   );
}
