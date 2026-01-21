import { AlertTriangle, ArrowLeft, Info, Video } from "lucide-react";
import Link from "next/link";
import UploadRecordingVideoSection from "@/features/simpleRecordings/components/UploadRecordingVideoSection";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function UploadVideoPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="mx-auto p-4 max-w-2xl">
            <div className="bg-white shadow-sm p-6 border border-red-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 text-red-600" />
                  <div>
                     <h1 className="font-semibold text-gray-900 text-lg">Grabación no encontrada</h1>
                     <p className="mt-1 text-gray-600 text-sm">La grabación que buscas no existe o fue eliminada.</p>
                     <div className="mt-4">
                        <Link
                           href="/recordings"
                           className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                           <ArrowLeft className="size-4" />
                           Volver a grabaciones
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   const recordingPresentation = await getRecordingPresentationByRecordingId(recordingId);

   if (recording.recordingType === "camera_and_presentation" && recordingPresentation) {
      return (
         <div className="mx-auto p-4 max-w-2xl">
            <div className="bg-white shadow-sm p-6 border border-yellow-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-5 text-yellow-600" />
                  <div>
                     <h1 className="font-semibold text-gray-900 text-lg">La grabación ya tiene una presentación</h1>
                     <p className="mt-1 text-gray-600 text-sm">
                        No es posible subir un video para una grabación que ya tiene una presentación asociada.
                     </p>
                     <p className="mt-1 text-gray-600 text-sm">
                        Si deseas subir un video, elimina la presentación y crea una nueva grabación con el tipo adecuado.
                     </p>
                     <div className="mt-4">
                        <Link
                           href="/recordings"
                           className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                           <ArrowLeft className="size-4" />
                           Volver a grabaciones
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (recording.muxAssetId && recording.muxPlaybackId) {
      return (
         <div className="mx-auto p-4 max-w-2xl">
            <div className="bg-white shadow-sm p-6 border border-blue-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <Video className="mt-0.5 size-5 text-blue-600" />
                  <div>
                     <h1 className="font-semibold text-gray-900 text-lg">La grabación ya tiene un video</h1>
                     <p className="mt-1 text-gray-600 text-sm">No se puede subir un nuevo video para esta grabación.</p>
                     <div className="mt-4">
                        <Link
                           href="/recordings"
                           className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                           <ArrowLeft className="size-4" />
                           Volver a grabaciones
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="mx-auto p-4 max-w-3xl">
         <div className="mb-4">
            <Link href="/recordings" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
               <ArrowLeft className="size-4" />
               Volver a grabaciones
            </Link>
         </div>
         <div className="mb-4">
            <h1 className="font-semibold text-gray-900 text-2xl">Subir video para: {recording.title}</h1>
            <p className="mt-1 text-gray-600 text-sm">Selecciona tu archivo de video para comenzar la subida.</p>
         </div>
         <UploadRecordingVideoSection recordingId={recordingId} />
      </div>
   );
}
