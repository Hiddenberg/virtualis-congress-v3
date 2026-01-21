import MuxPlayer from "@mux/mux-player-react";
import { ArrowRightIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import GoBackButton from "@/components/global/GoBackButton";
import UnlinkSpeakerPresentationRecordingButton from "@/features/conferences/components/conferenceSpeakerPresentation/UnlinkSpeakerPresentationRecordingButton";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerPresentationRecordingByConferenceId } from "@/features/conferences/services/conferenceSpeakerPresentationRecordingServices";

export default async function SpeakerPresentationRecordingPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
         </div>
      );
   }

   const speakerPresentationRecording = await getSpeakerPresentationRecordingByConferenceId(conferenceId);

   return (
      <div className="p-6">
         <GoBackButton className="mb-6" backURL="/congress-admin/conferences" backButtonText="Volver a conferencias" />

         <div className="mb-8">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Presentación del ponente</h1>
            <p className="text-gray-600 text-lg">{conference.title}</p>
         </div>

         {speakerPresentationRecording ? (
            <div className="space-y-6">
               {/* Recording Info Card */}
               <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex-1">
                        <h2 className="mb-2 font-bold text-gray-900 text-xl">Grabación de la presentación del ponente</h2>
                        <p className="mb-3 text-gray-600">{speakerPresentationRecording.title}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-gray-500 text-sm">Estado:</span>
                           <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium ring-1 ${
                                 speakerPresentationRecording.status === "ready"
                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                    : speakerPresentationRecording.status === "processing"
                                      ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                      : "bg-gray-50 text-gray-700 ring-gray-600/20"
                              }`}
                           >
                              {speakerPresentationRecording.status === "ready"
                                 ? "Lista"
                                 : speakerPresentationRecording.status === "processing"
                                   ? "Procesando"
                                   : speakerPresentationRecording.status}
                           </span>
                        </div>
                     </div>
                     <UnlinkSpeakerPresentationRecordingButton conferenceId={conferenceId} />
                  </div>
               </div>

               {/* Video Player Card */}
               {speakerPresentationRecording.status === "ready" && speakerPresentationRecording.muxPlaybackId && (
                  <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
                     <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">Reproductor de video</h3>
                        <p className="text-gray-600 text-sm">Visualiza la grabación de la presentación del ponente</p>
                     </div>
                     <div className="flex justify-center">
                        <MuxPlayer
                           playbackId={speakerPresentationRecording.muxPlaybackId}
                           className="shadow-lg rounded-xl w-full max-w-4xl aspect-video overflow-hidden"
                        />
                     </div>
                  </div>
               )}
            </div>
         ) : (
            <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-lg">
               <div className="text-center">
                  <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-16 h-16">
                     <ArrowRightIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="mb-2 font-bold text-gray-900 text-xl">No hay presentación del ponente vinculada</h2>
                  <p className="mb-6 text-gray-600">
                     Vincula una grabación de presentación para que esté disponible en esta conferencia
                  </p>
                  <LinkButton
                     href={`/congress-admin/conferences/${conferenceId}/speaker-presentation-recording/link`}
                     variant="blue"
                     className="mx-auto"
                  >
                     Vincular presentación del ponente
                     <ArrowRightIcon className="w-4 h-4" />
                  </LinkButton>
               </div>
            </div>
         )}
      </div>
   );
}
