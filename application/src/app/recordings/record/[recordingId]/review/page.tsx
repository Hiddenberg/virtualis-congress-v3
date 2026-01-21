import MuxPlayer from "@mux/mux-player-react/lazy";
import { AlertCircle, Clock, Eye, Play, RotateCcw, Save, User, Volume2 } from "lucide-react";
import PresentationAndVideoPlayer from "@/features/pptPresentations/components/PresentationAndVideoPlayer";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import { ReviewRecordingButtons } from "@/features/simpleRecordings/components/ReviewRecordingButtons";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function ReviewRecordingPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md text-center">
               <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
               <h1 className="mb-2 font-semibold text-gray-900 text-xl">Grabación no encontrada</h1>
               <p className="text-gray-600">La grabación con ID {recordingId} no existe o no tienes permisos para verla.</p>
            </div>
         </div>
      );
   }

   if (recording.status !== "uploading" && !recording.muxPlaybackId) {
      return (
         <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md text-center">
               <Clock className="mx-auto mb-4 size-12 text-amber-500" />
               <h1 className="mb-2 font-semibold text-gray-900 text-xl">Grabación en proceso</h1>
               <p className="text-gray-600">Tu grabación aún se está procesando. Por favor, vuelve a intentar en unos minutos.</p>
               <div className="bg-amber-50 mt-4 p-3 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                     Estado actual: <span className="font-medium">{recording.status}</span>
                  </p>
               </div>
            </div>
         </div>
      );
   }

   const presentation = await getRecordingPresentationByRecordingId(recordingId);
   const presentationSlides = await getPresentationSlidesById(presentation?.id || "");
   const presentationRecording = await getPresentationRecordingByPresentationId(presentation?.id || "");

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="mx-auto p-4 lg:p-8 max-w-6xl">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white shadow-sm mb-4 p-4 border border-gray-200 rounded-xl">
               <h1 className="font-bold text-gray-900 text-2xl text-center truncate capitalize">{recording.title}</h1>
               <div className="flex items-center gap-1.5 text-sm">
                  <User className="size-4" />
                  <span>{recording.recorderName}</span>
               </div>
            </div>

            {/* Main Content */}
            <div className="gap-6 grid grid-cols-1">
               {/* Action Buttons */}
               <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
                  <div className="text-center">
                     <h2 className="mb-2 font-semibold text-gray-900 text-lg">¿Estás satisfecho con tu grabación?</h2>
                     <p className="text-gray-600">Revisa tu grabación en la parte inferior de la página.</p>
                     <p className="mb-6 text-gray-600">
                        Una vez que guardes la grabación, será enviada para su procesamiento final.
                     </p>
                     <ReviewRecordingButtons />
                  </div>
               </div>

               {/* Video Player */}
               <div className="">
                  <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                     <div className="">
                        {(recording.recordingType === "only_camera" ||
                           (recording.recordingType === "camera_and_presentation" && !presentationRecording)) && (
                           <MuxPlayer
                              className="w-full h-full !aspect-video"
                              playbackId={recording.muxPlaybackId}
                              metadata={{
                                 title: recording.title,
                              }}
                              streamType="on-demand"
                              autoPlay={false}
                              muted={false}
                              preload="none"
                           />
                        )}

                        {recording.recordingType === "camera_and_presentation" && presentationRecording && (
                           <PresentationAndVideoPlayer
                              muxPlaybackId={recording.muxPlaybackId || ""}
                              presentationSlides={presentationSlides}
                              presentationRecording={presentationRecording!}
                           />
                        )}
                     </div>
                  </div>
               </div>

               {/* Instructions */}
               <div className="bg-blue-50 p-6 border border-blue-200 rounded-xl">
                  <h3 className="mb-6 font-semibold text-blue-900 text-lg text-center">¿Qué hacer ahora?</h3>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                     <div className="bg-white/60 p-4 rounded-lg text-center">
                        <Play className="mx-auto mb-2 size-8 text-blue-600" />
                        <p className="font-medium text-blue-900 text-sm">Revisa tu grabación completa</p>
                     </div>
                     <div className="bg-white/60 p-4 rounded-lg text-center">
                        <Volume2 className="mx-auto mb-2 size-8 text-blue-600" />
                        <p className="font-medium text-blue-900 text-sm">Verifica que el audio se escuche correctamente</p>
                     </div>
                     <div className="bg-white/60 p-4 rounded-lg text-center">
                        <Eye className="mx-auto mb-2 size-8 text-blue-600" />
                        <p className="font-medium text-blue-900 text-sm">Asegúrate de que la imagen esté clara</p>
                     </div>
                     <div className="bg-white/60 p-4 rounded-lg text-center">
                        <Save className="mx-auto mb-2 size-8 text-green-600" />
                        <p className="font-medium text-blue-900 text-sm">Si todo está bien, guarda la grabación</p>
                     </div>
                     <div className="bg-white/60 p-4 rounded-lg text-center">
                        <RotateCcw className="mx-auto mb-2 size-8 text-amber-600" />
                        <p className="font-medium text-blue-900 text-sm">Si no estás satisfecho, puedes volver a grabar</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
