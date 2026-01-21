/* eslint-disable @next/next/no-img-element */

import { CheckCircleIcon, InfoIcon, MonitorIcon, VideoIcon } from "lucide-react";
import GoBackButton from "@/components/global/GoBackButton";
import UploadRecordingVideoSection from "@/features/simpleRecordings/components/UploadRecordingVideoSection";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function UploadRecordingPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
               <h1 className="mb-2 font-bold text-gray-900 text-2xl">Grabación no encontrada</h1>
               <p className="text-gray-600">La grabación que buscas no existe o no tienes permisos para acceder a ella.</p>
            </div>
         </div>
      );
   }

   const zoomLogoURL = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757811385/d151a6d1-ea9a-40de-92e6-f1da028a5e43.webp";
   const loomLogoURL = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757811845/c5f8d8b2-245f-40a3-8c9e-00feb91b2281.webp";

   return (
      <div className="bg-gray-50 px-4 py-8 min-h-screen">
         <GoBackButton />
         <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            {/* Header Section */}
            <div className="mb-8 text-center">
               <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-16 h-16">
                  <VideoIcon className="w-8 h-8 text-blue-600" />
               </div>
               <h1 className="mb-2 font-bold text-gray-900 text-3xl">Graba y sube tu video</h1>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">
                  Para: <span className="font-semibold text-gray-900">{recording.title}</span>
               </p>
            </div>

            {/* Simple Instructions */}
            <div className="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-xl">
               <div className="flex items-start gap-3 mb-4">
                  <InfoIcon className="mt-0.5 w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                     <h2 className="mb-2 font-semibold text-gray-900 text-lg">¿Cómo funciona?</h2>
                     <p className="text-gray-600">Graba tu video con cualquier herramienta y súbelo aquí en formato MP4.</p>
                  </div>
               </div>

               {/* Quick Steps */}
               <div className="gap-4 grid sm:grid-cols-3 mt-6">
                  <div className="text-center">
                     <div className="flex justify-center items-center bg-blue-100 mx-auto mb-2 rounded-full w-8 h-8 font-semibold text-blue-600 text-sm">
                        1
                     </div>
                     <p className="font-medium text-gray-900 text-sm">Graba</p>
                  </div>

                  <div className="text-center">
                     <div className="flex justify-center items-center bg-blue-100 mx-auto mb-2 rounded-full w-8 h-8 font-semibold text-blue-600 text-sm">
                        2
                     </div>
                     <p className="font-medium text-gray-900 text-sm">Guarda en MP4</p>
                  </div>

                  <div className="text-center">
                     <div className="flex justify-center items-center bg-blue-100 mx-auto mb-2 rounded-full w-8 h-8 font-semibold text-blue-600 text-sm">
                        3
                     </div>
                     <p className="font-medium text-gray-900 text-sm">Sube aquí</p>
                  </div>
               </div>
            </div>

            {/* Recording Tools */}
            <div className="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-xl">
               <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                  <MonitorIcon className="w-5 h-5 text-gray-700" />
                  Herramientas recomendadas
               </h3>

               <div className="gap-3 grid sm:grid-cols-3">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                     <img src={zoomLogoURL} alt="Zoom" className="rounded w-8 h-8" />
                     <div>
                        <p className="font-medium text-gray-900 text-sm">Zoom</p>
                        <p className="text-gray-600 text-xs">Pantalla compartida</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                     <img src={loomLogoURL} alt="Loom" className="rounded w-8 h-8" />
                     <div>
                        <p className="font-medium text-gray-900 text-sm">Loom</p>
                        <p className="text-gray-600 text-xs">Rápido y fácil</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                     <VideoIcon className="w-8 h-8 text-gray-600" />
                     <div>
                        <p className="font-medium text-gray-900 text-sm">Otros</p>
                        <p className="text-gray-600 text-xs">Teams, Meet, OBS</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Upload Section */}
            <UploadRecordingVideoSection
               recordingId={recordingId}
               redirectTo={`/recordings/record/${recordingId}/recording-saved`}
            />

            {/* Simple Tips */}
            <div className="mt-6 text-center">
               <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                  <div className="flex justify-center items-center gap-2 mb-2">
                     <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                     <span className="font-medium text-blue-800 text-sm">Consejos rápidos</span>
                  </div>
                  <p className="text-blue-700 text-sm">Audio claro • Buena iluminación • Formato MP4 • Mínimo 720p</p>
               </div>
            </div>
         </div>
      </div>
   );
}
