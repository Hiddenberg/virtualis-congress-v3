import Image from "next/image";
import SelfContainedRealtimeChatViewer from "@/features/chats/components/SelfContainedRealtimeChatViewer";
import ConferenceCountdown from "@/features/conferences/components/ConferenceCountdown";
import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";
import { getConferenceRecording } from "@/features/conferences/services/conferenceRecordingsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonState";
import DynamicZoomCallInterface from "@/features/livestreams/components/DynamicZoomCallInterface";
import { ZoomSessionProvider } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import RealtimePresentationViewer from "@/features/pptPresentations/components/realtime/RealtimePresentationViewer";
import FixedScaleStage from "@/features/projectionScreen/components/FixedScaleStage";
import LobbyQrCodeWidget from "@/features/projectionScreen/components/LobbyQrCodeWidget";
import RealtimeCameraComponent from "@/features/projectionScreen/components/RealtimeCameraComponent";
import StandbyScreen from "@/features/projectionScreen/components/StandbyScreen";
import SelfContainedRealtimeQuestionPollCompactDisplay from "@/features/questionPolls/components/realtime/SelfContainedRealtimeQuestionPollCompactDisplay";
import SimuliveStagesWrapper from "@/features/simulive/components/SimuliveStagesWrapper";

export default async function ProjectionScreenPage() {
   const congressInPersonState = await ensuredCongressInPersonState();
   const congress = await getLatestCongress();
   const organization = await getOrganizationFromSubdomain();
   const { nextConference } = await getActiveAndNextConferences();

   if (congressInPersonState.status === "standby" || !congressInPersonState.activeConference) {
      return <StandbyScreen nextConference={nextConference} organization={organization} congress={congress} />;
   }

   const activeConferenceId = congressInPersonState.activeConference;

   // const conference = await getConferenceById(conferenceId)
   const conference = await getConferenceById(activeConferenceId);
   const conferencePresentation = await getConferencePresentation(activeConferenceId);
   const conferenceSpeakers = await getConferenceSpeakers(activeConferenceId);
   const conferenceSpeaker = conferenceSpeakers[0] ?? null;

   const platformQrURL = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757052238/qr-code_1_mpdft8.webp";

   if (!conference) {
      return (
         <div>
            <h1>No se encontró la conferencia {activeConferenceId}</h1>
         </div>
      );
   }

   const conferenceQnaLivestreamSession = await getConferenceQnASession(activeConferenceId);

   console.log(conferenceQnaLivestreamSession);
   if (conferenceQnaLivestreamSession && conferenceQnaLivestreamSession.status === "streaming") {
      return (
         <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
            <FixedScaleStage baseWidth={1400} baseHeight={1080} className="mx-auto">
               {/* header */}
               {/* <div className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
                  style={{
                     maxWidth: 1400
                  }}
               >
                  <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3">
                     <Image
                        width={414}
                        height={156}
                        src={organization.logoURL ?? ""}
                        alt={`${organization.name} logo`}
                        className="w-36 md:w-48 h-auto"
                     />
                     <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl w-28 md:w-32 h-11 md:h-12 font-medium text-slate-700 text-sm">Logo2</div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                     <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{congress?.title}</div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                     <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl h-11 md:h-12 font-medium text-slate-700 text-sm">Timer</div>
                  </div>
               </div> */}

               {/* main content */}
               <div
                  className="gap-4 grid grid-cols-12 mx-auto"
                  style={{
                     maxWidth: 1400,
                  }}
               >
                  {/* left side */}
                  <div className="flex flex-col gap-4 col-span-12 md:col-span-12">
                     {/* presentation and video player */}
                     <div
                        className="flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                        style={{
                           height: 900,
                        }}
                     >
                        {/* <span className="font-medium text-white/90 text-lg md:text-xl">Presentación / Video</span> */}
                        <ZoomSessionProvider
                           sessionName={`${conference.title}-qna`}
                           sessionKey={conferenceQnaLivestreamSession.id}
                        >
                           <DynamicZoomCallInterface initialUsername="Pantalla Proyección" className="w-full" />
                        </ZoomSessionProvider>
                     </div>

                     {/* conference title */}
                     {/* <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{conference?.title}</div> */}

                     {/* bottom widgets */}
                     {/* <div className="gap-4 grid grid-cols-2">
                        <SelfContainedRealtimeQuestionPollCompactDisplay conferenceId={activeConferenceId} />
                        <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800" />
                        <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                           <QrCodeWidget />
                        </div>
                     </div> */}
                  </div>

                  {/* right side */}
                  {/* <div className="flex flex-col gap-4 col-span-4">

                     <div className="flex flex-col gap-3 bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl"
                        style={{
                           height: 320
                        }}
                     >
                        <div className="flex justify-center items-center bg-blue-50/80 shadow-sm border border-slate-300 rounded-xl h-10 font-semibold text-slate-800 text-sm">{conferenceSpeaker?.displayName}</div>
                        <div className="flex flex-1 justify-center items-center bg-black/30 border border-slate-300 rounded-xl text-white/90">
                           <RealtimeCameraComponent />
                        </div>
                     </div>

      
                     <div className="flex justify-center bg-white/70 shadow-sm border border-slate-300 rounded-2xl font-medium text-slate-800"
                        style={{
                           height: 420
                        }}
                     >
                        <SelfContainedRealtimeChatViewer
                           conferenceId={activeConferenceId}
                        />
                     </div>
                  </div> */}
               </div>
            </FixedScaleStage>
         </div>
      );
   }

   if (conference.conferenceType === "simulated_livestream") {
      const conferenceRecording = await getConferenceRecording(activeConferenceId);

      return (
         <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
            <FixedScaleStage baseWidth={1400} baseHeight={870} className="mx-auto">
               {/* header */}
               {/* <div className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
               style={{
                  maxWidth: 1400
               }}
            >
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3">
                  <Image
                     width={414}
                     height={156}
                     src={organization.logoURL ?? ""}
                     alt={`${organization.name} logo`}
                     className="w-36 md:w-48 h-auto"
                  />
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl w-28 md:w-32 h-11 md:h-12 font-medium text-slate-700 text-sm">Logo2</div>
               </div>
               <div className="col-span-12 md:col-span-6">
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{congress?.title}</div>
               </div>
               <div className="col-span-12 md:col-span-3">
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl h-11 md:h-12 font-medium text-slate-700 text-sm">Timer</div>
               </div>
            </div> */}

               {/* main content */}
               <div
                  className="gap-4 grid grid-cols-12 mx-auto"
                  style={{
                     maxWidth: 1400,
                  }}
               >
                  {/* left side */}
                  <div className="flex flex-col gap-4 col-span-12 md:col-span-10">
                     {/* presentation and video player */}
                     <div
                        className="flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                        style={{
                           height: 610,
                        }}
                     >
                        {/* <span className="font-medium text-white/90 text-lg md:text-xl">Presentación / Video</span> */}
                        <SimuliveStagesWrapper
                           conference={conference}
                           conferenceRecording={conferenceRecording}
                           simuliveData={{
                              startDateTime: new Date().toISOString(),
                              serverTime: new Date().toISOString(),
                              durationSeconds: conferenceRecording?.durationSeconds ?? 0,
                              speakerPresentationRecording: null,
                           }}
                           isQna={false}
                        />
                     </div>

                     {/* conference title */}
                     {/* <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{conference?.title}</div> */}

                     {/* bottom widgets */}
                     <div className="gap-4 grid grid-cols-2">
                        <SelfContainedRealtimeQuestionPollCompactDisplay conferenceId={activeConferenceId} />
                        {/* <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                  </div> */}
                        <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl h-[220px] min-h-[180px] font-medium text-slate-800">
                           <img src={platformQrURL} alt="Plataforma QR" className="w-auto h-full" />
                           <ConferenceCountdown conference={conference} />
                        </div>
                     </div>
                  </div>

                  {/* right side */}
                  <div className="flex flex-col gap-4 col-span-2">
                     {/* camera + speaker */}
                     <div
                        className="flex flex-col gap-3 bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl"
                        style={{
                           height: 320,
                        }}
                     >
                        <div className="flex justify-center items-center bg-blue-50/80 shadow-sm border border-slate-300 rounded-xl h-10 font-semibold text-slate-800 text-sm">
                           {conferenceSpeaker?.displayName}
                        </div>
                        {/* <div className="flex flex-1 justify-center items-center bg-black/30 border border-slate-300 rounded-xl text-white/90">
                           <RealtimeCameraComponent />
                        </div> */}
                     </div>

                     {/* chat */}
                     {/* If there's a full chat component, render it here, else keep placeholder with fixed height */}
                     <div
                        className="flex justify-center bg-white/70 shadow-sm border border-slate-300 rounded-2xl font-medium text-slate-800"
                        style={{
                           height: 420,
                        }}
                     >
                        <SelfContainedRealtimeChatViewer conferenceId={activeConferenceId} />
                     </div>
                  </div>
               </div>
            </FixedScaleStage>
         </div>
      );
   }

   if (!conferencePresentation || conferencePresentation.hasVideo) {
      const livestreamSession = await getConferenceLivestreamSession(activeConferenceId);

      if (!livestreamSession) {
         return (
            <div>
               <h1>No se encontró la sesión de transmisión para la conferencia {activeConferenceId}</h1>
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
                  <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3">
                     <Image
                        width={414}
                        height={156}
                        src={organization.logoURL ?? ""}
                        alt={`${organization.name} logo`}
                        className="w-36 md:w-48 h-auto"
                     />
                     {/* <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl w-28 md:w-32 h-11 md:h-12 font-medium text-slate-700 text-sm">Logo2</div> */}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                     <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                        {congress?.title}
                     </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                     <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl h-11 md:h-12 font-medium text-slate-700 text-sm">
                        Timer
                     </div>
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
                        <ZoomSessionProvider sessionName={`${conference.title}-conf`} sessionKey={livestreamSession.id}>
                           <DynamicZoomCallInterface initialUsername="Pantalla Proyección" className="w-full" />
                        </ZoomSessionProvider>
                     </div>

                     {/* conference title */}
                     {/* <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{conference?.title}</div> */}

                     {/* bottom widgets */}
                     <div className="gap-4 grid grid-cols-2">
                        <SelfContainedRealtimeQuestionPollCompactDisplay conferenceId={activeConferenceId} />
                        {/* <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                  </div> */}
                        <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                           <LobbyQrCodeWidget />
                        </div>
                     </div>
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

                     {/* chat */}
                     {/* If there's a full chat component, render it here, else keep placeholder with fixed height */}
                     <div
                        className="flex justify-center bg-white/70 shadow-sm border border-slate-300 rounded-2xl font-medium text-slate-800"
                        style={{
                           height: 420,
                        }}
                     >
                        <SelfContainedRealtimeChatViewer conferenceId={activeConferenceId} />
                     </div>
                  </div>
               </div>
            </FixedScaleStage>
         </div>
      );
   }

   return (
      <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
         <FixedScaleStage baseWidth={1400} baseHeight={870} className="mx-auto">
            {/* header */}
            {/* <div className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
               style={{
                  maxWidth: 1400
               }}
            >
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3">
                  <Image
                     width={414}
                     height={156}
                     src={organization.logoURL ?? ""}
                     alt={`${organization.name} logo`}
                     className="w-36 md:w-48 h-auto"
                  />
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl w-28 md:w-32 h-11 md:h-12 font-medium text-slate-700 text-sm">Logo2</div>
               </div>
               <div className="col-span-12 md:col-span-6">
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{congress?.title}</div>
               </div>
               <div className="col-span-12 md:col-span-3">
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl h-11 md:h-12 font-medium text-slate-700 text-sm">Timer</div>
               </div>
            </div> */}

            {/* main content */}
            <div
               className="gap-4 grid grid-cols-12 mx-auto"
               style={{
                  maxWidth: 1400,
               }}
            >
               {/* left side */}
               <div className="flex flex-col gap-4 col-span-12 md:col-span-10">
                  {/* presentation and video player */}
                  <div
                     className="flex justify-center items-center bg-black/40 shadow-inner border border-slate-300 rounded-2xl overflow-hidden"
                     style={{
                        height: 610,
                     }}
                  >
                     {/* <span className="font-medium text-white/90 text-lg md:text-xl">Presentación / Video</span> */}
                     <RealtimePresentationViewer showHeader={false} presentationId={conferencePresentation?.id ?? ""} />
                  </div>

                  {/* conference title */}
                  {/* <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">{conference?.title}</div> */}

                  {/* bottom widgets */}
                  <div className="gap-4 grid grid-cols-2">
                     <SelfContainedRealtimeQuestionPollCompactDisplay conferenceId={activeConferenceId} />
                     {/* <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                  </div> */}
                     <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl h-[220px] min-h-[180px] font-medium text-slate-800">
                        <img src={platformQrURL} alt="Plataforma QR" className="w-auto h-full" />
                        <ConferenceCountdown conference={conference} />
                     </div>
                  </div>
               </div>

               {/* right side */}
               <div className="flex flex-col gap-4 col-span-2">
                  {/* camera + speaker */}
                  <div
                     className="flex flex-col gap-3 bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl"
                     style={{
                        height: 320,
                     }}
                  >
                     <div className="flex justify-center items-center bg-blue-50/80 shadow-sm border border-slate-300 rounded-xl h-10 font-semibold text-slate-800 text-sm">
                        {conferenceSpeaker?.displayName}
                     </div>
                     <div className="flex flex-1 justify-center items-center bg-black/30 border border-slate-300 rounded-xl text-white/90">
                        <RealtimeCameraComponent />
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
                     <SelfContainedRealtimeChatViewer conferenceId={activeConferenceId} />
                  </div>
               </div>
            </div>
         </FixedScaleStage>
      </div>
   );
}
