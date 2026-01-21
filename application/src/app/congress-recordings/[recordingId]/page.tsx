import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeft, Clock, Home, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { checkIfUserHasAccessToRecordings } from "@/features/organizationPayments/services/userPurchaseServices";
import PresentationAndVideoPlayer from "@/features/pptPresentations/components/PresentationAndVideoPlayer";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

function formatDuration(seconds?: number | null) {
   if (!seconds || seconds <= 0) return null;
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   if (hours > 0) return `${hours}h ${minutes}m`;
   return `${minutes}m`;
}

export default async function CongressRecordingPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const congress = await getLatestCongress();
   const userId = await getLoggedInUserId();
   const hasAccessToRecording = await checkIfUserHasAccessToRecordings(userId ?? "", congress.id);

   if (!hasAccessToRecording) {
      return redirect("/congress-recordings/buy");
   }

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
            <div className="bg-red-50 p-6 border border-red-200 rounded-xl text-center">
               <h1 className="mb-2 font-semibold text-red-900 text-xl">Grabación no encontrada</h1>
               <p className="mb-4 text-red-700">La grabación que buscas no existe o no tienes permiso para verla.</p>
               <LinkButton href="/congress-recordings" variant="secondary" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a grabaciones
               </LinkButton>
            </div>
         </div>
      );
   }

   const recordingPresentation = await getRecordingPresentationByRecordingId(recording.id);
   const presentationSlides = await getPresentationSlidesById(recordingPresentation?.id ?? "");
   const presentationRecording = await getPresentationRecordingByPresentationId(recordingPresentation?.id ?? "");

   const allConferences = await getAllCongressConferences(congress.id);
   const recordingTitle = recording.title.split(" - ")[1] ?? recording.title;
   const conference = allConferences.find((conf) => conf.title === recordingTitle);
   const speakers = await getConferenceSpeakers(conference?.id ?? "");
   const durationLabel = formatDuration(recording.durationSeconds);

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
         {/* Breadcrumb */}
         <div className="mb-6">
            <Link
               href="/congress-recordings"
               className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               Volver a grabaciones
            </Link>
         </div>

         {/* Header */}
         <div className="mb-6">
            <div className="mb-2 text-slate-500 text-sm">Grabación de la ponencia</div>
            <h1 className="font-bold text-slate-900 text-2xl md:text-3xl leading-tight">{recordingTitle}</h1>
            {conference?.shortDescription && (
               <p className="mt-2 max-w-3xl text-slate-600 text-base md:text-lg">{conference.shortDescription}</p>
            )}
            {speakers.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-3">
                  {speakers.map((speaker) => (
                     <span
                        key={speaker.id}
                        className="inline-flex items-center bg-blue-50 px-3 py-1 border border-blue-100 rounded-full font-medium text-blue-700 text-xs md:text-sm"
                     >
                        {speaker.displayName}
                     </span>
                  ))}
               </div>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600 text-sm">
               <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                     {speakers.length} {speakers.length === 1 ? "ponente" : "ponentes"}
                  </span>
               </div>
               {durationLabel && (
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4" />
                     <span>{durationLabel}</span>
                  </div>
               )}
            </div>
         </div>

         {/* Player Card */}
         <div className="bg-white p-3 md:p-4 rounded-xl">
            <div className="mx-auto max-h-[80vh] aspect-video">
               {recording.status === "ready" && recording.muxPlaybackId && !recordingPresentation && (
                  <div className="bg-slate-100 mb-3 rounded-lg aspect-video overflow-hidden">
                     <MuxPlayer
                        playbackId={recording.muxPlaybackId}
                        metadataVideoTitle={recording.title}
                        preload="none"
                        className="w-full h-full"
                     />
                  </div>
               )}

               {recording.status === "ready" && recording.muxPlaybackId && recordingPresentation && presentationRecording && (
                  <div className="bg-slate-100 mb-3 rounded-lg">
                     <PresentationAndVideoPlayer
                        isSmall={true}
                        muxPlaybackId={recording.muxPlaybackId}
                        presentationSlides={presentationSlides || []}
                        presentationRecording={presentationRecording}
                     />
                  </div>
               )}
            </div>
         </div>

         {/* Footer actions */}
         <div className="flex justify-center items-center gap-3 mt-6">
            <LinkButton href="/congress-recordings" variant="secondary">
               <ArrowLeft className="w-4 h-4" />
               Volver a grabaciones
            </LinkButton>
            <LinkButton href="/lobby" variant="blue">
               <Home className="w-4 h-4" />
               Ir al lobby
            </LinkButton>
         </div>
      </div>
   );
}
