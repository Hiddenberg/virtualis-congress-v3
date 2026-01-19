import Image from "next/image";
import SelfContainedRealtimeChatViewer from "@/features/chats/components/SelfContainedRealtimeChatViewer";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import RealtimePresentationViewer from "@/features/pptPresentations/components/realtime/RealtimePresentationViewer";
import FixedScaleStage from "@/features/projectionScreen/components/FixedScaleStage";
import RealtimeCameraComponent from "@/features/projectionScreen/components/RealtimeCameraComponent";
import SelfContainedRealtimeQuestionPollCompactDisplay from "@/features/questionPolls/components/realtime/SelfContainedRealtimeQuestionPollCompactDisplay";

export default async function ProjectionScreenPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   const congress = await getLatestCongress();
   const organization = await getOrganizationFromSubdomain();
   const conferencePresentation = await getConferencePresentation(conferenceId);
   const conferenceSpeakers = await getConferenceSpeakers(conferenceId);
   const conferenceSpeaker = conferenceSpeakers[0] ?? null;

   return (
      <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
         <FixedScaleStage baseWidth={1400} baseHeight={970} className="mx-auto">
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
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl w-28 md:w-32 h-11 md:h-12 font-medium text-slate-700 text-sm">
                     Logo2
                  </div>
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
                     <RealtimePresentationViewer
                        showHeader={false}
                        presentationId={conferencePresentation?.id ?? ""}
                     />
                  </div>

                  {/* conference title */}
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                     {conference?.title}
                  </div>

                  {/* bottom widgets */}
                  <div className="gap-4 grid grid-cols-2">
                     <SelfContainedRealtimeQuestionPollCompactDisplay
                        conferenceId={conferenceId}
                     />
                     {/* <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                  </div> */}
                     <div className="flex justify-center items-center bg-yellow-50/70 shadow-sm border border-slate-300 rounded-2xl min-h-[180px] font-medium text-slate-800">
                        Carrusel
                     </div>
                  </div>
               </div>

               {/* right side */}
               <div className="flex flex-col gap-4 col-span-4">
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
                        height: 340,
                     }}
                  >
                     <SelfContainedRealtimeChatViewer
                        conferenceId={conferenceId}
                     />
                  </div>
               </div>
            </div>
         </FixedScaleStage>
      </div>
   );
}
