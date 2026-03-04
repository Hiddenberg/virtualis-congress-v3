import { AlertCircle, RotateCcw, Wifi } from "lucide-react";
import { redirect } from "next/navigation";
import { RecordAgainButton } from "@/features/simpleRecordings/components/ReviewRecordingButtons";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function ErrorPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden">
               <div className="bg-red-50 p-8 border-red-100 border-b text-center">
                  <AlertCircle className="mx-auto mb-4 size-16 text-red-500" />
                  <h1 className="mb-2 font-bold text-gray-900 text-xl">Grabación no encontrada</h1>
                  <p className="text-gray-600">
                     La grabación que buscas no existe o no tienes permisos para acceder a ella por favor contacta al organizador
                  </p>
               </div>
            </div>
         </div>
      );
   }

   if (recording.status !== "error") {
      return redirect(`/recordings/record/${recordingId}/review`);
   }

   return (
      <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
         <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 p-8 border-red-100 border-b text-center">
               <AlertCircle className="mx-auto mb-4 size-16 text-red-500" />
               <h1 className="mb-2 font-bold text-gray-900 text-xl">Ha ocurrido un error al procesar la grabación</h1>
               <p className="text-gray-600">
                  Lo sentimos, hubo un problema al procesar tu video. No te preocupes, puedes intentar de nuevo.
               </p>
            </div>

            {/* Error details (if available) */}
            {recording.errorMessage && (
               <div className="bg-red-50/50 mx-6 mt-6 p-4 border border-red-100 rounded-lg">
                  <p className="font-medium text-red-800 text-sm">Detalle del error:</p>
                  <p className="mt-1 text-red-700 text-sm">{recording.errorMessage}</p>
               </div>
            )}

            {/* Helpful tips */}
            <div className="space-y-6 p-6">
               <div>
                  <h2 className="mb-3 font-semibold text-gray-900">¿Qué puedes hacer?</h2>
                  <ul className="space-y-3 text-gray-600 text-sm">
                     <li className="flex items-start gap-3">
                        <Wifi className="mt-0.5 size-4 text-blue-500 shrink-0" />
                        <span>Verifica que tu conexión a internet sea estable</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <RotateCcw className="mt-0.5 size-4 text-amber-500 shrink-0" />
                        <span>Vuelve a grabar tu presentación</span>
                     </li>
                  </ul>
               </div>

               {/* Actions */}
               <div className="space-y-3">
                  <RecordAgainButton buttonText="Volver a grabar" className="w-full!" />
               </div>
            </div>
         </div>
      </div>
   );
}
