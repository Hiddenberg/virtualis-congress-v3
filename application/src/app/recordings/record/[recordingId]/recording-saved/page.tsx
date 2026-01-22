import { AwardIcon, CheckCircle2, Clock } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { getCertificateDesign } from "@/features/certificates/services/certificateDesignServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getRecordingsCampaignById } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function RecordingSavedPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);
   if (!recording) {
      return (
         <div>
            <h1>No se encontró la grabación</h1>
         </div>
      );
   }
   const recordingCampaign = await getRecordingsCampaignById(recording.campaign);
   const isConferenceRecording = recordingCampaign?.title.startsWith("Conferencias del congreso:");
   const congress = await getLatestCongress();
   const speakerCertificateDesign = await getCertificateDesign({
      congressId: congress.id,
      certificateType: "speaker",
   });

   return (
      <div className="flex justify-center items-center bg-linear-to-br from-green-50 to-blue-50 p-4 min-h-screen">
         <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden">
            {/* Header with success animation */}
            <div className="bg-linear-to-r from-green-500 to-green-600 p-8 text-center">
               <div className="animate-bounce">
                  <CheckCircle2 className="mx-auto mb-4 size-20 text-white" />
               </div>
               <h1 className="mb-2 font-bold text-white text-3xl">¡Grabación Guardada!</h1>
               <p className="text-green-100 text-lg">Tu video ha sido guardado exitosamente: {recording.title}</p>
            </div>

            {/* Main content */}
            <div className="p-8">
               <div className="mb-8 text-center">
                  <h2 className="mb-4 font-semibold text-gray-900 text-xl">¿Qué sucede ahora?</h2>
                  <p className="text-gray-600 leading-relaxed">
                     Tu grabación ha sido guardada y enviada para su procesamiento final.
                  </p>
               </div>

               {/* Process steps */}
               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-green-50 p-4 border border-green-200 rounded-lg">
                     <div className="shrink-0 bg-green-500 p-2 rounded-full">
                        <CheckCircle2 className="size-5 text-white" />
                     </div>
                     <div>
                        <h3 className="font-semibold text-green-900">Grabación completada</h3>
                        <p className="text-green-700 text-sm">Tu video ha sido capturado y guardado correctamente</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 bg-blue-50 p-4 border border-blue-200 rounded-lg">
                     <div className="shrink-0 bg-blue-500 p-2 rounded-full animate-pulse">
                        <Clock className="size-5 text-white" />
                     </div>
                     <div>
                        <h3 className="font-semibold text-blue-900">Procesamiento en curso</h3>
                        <p className="text-blue-700 text-sm">
                           Estamos optimizando tu video para la mejor calidad de reproducción
                        </p>
                     </div>
                  </div>

                  {isConferenceRecording && speakerCertificateDesign && (
                     <div className="flex items-center gap-4 bg-amber-50 p-4 border border-amber-200 rounded-lg">
                        <div className="shrink-0 bg-amber-500 p-2 rounded-full">
                           <AwardIcon className="size-5 text-white" />
                        </div>
                        <div>
                           <h3 className="font-semibold text-amber-900">Gracias por tu participación como ponente</h3>
                           <p className="text-amber-700 text-sm">Puedes obtener tu certificado de participación</p>
                           <LinkButton href="/certificates/speaker-certificate" variant="golden" className="mt-2 !text-lg">
                              <AwardIcon className="size-4" />
                              Obtener mi certificado
                           </LinkButton>
                        </div>
                     </div>
                  )}
               </div>

               {/* Nothing left to do message */}
               <div className="bg-gray-50 mb-8 p-6 border border-gray-200 rounded-lg text-center">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">Ya no hay nada más que hacer</h3>
                  <p className="mb-4 text-gray-600">Puedes cerrar esta página de forma segura.</p>
                  <p className="text-gray-500 text-sm">El proceso continuará automáticamente.</p>
               </div>

               {/* Footer message */}
               <div className="mt-8 pt-6 border-gray-200 border-t text-center">
                  <p className="text-gray-500 text-sm">
                     ¡Gracias por usar Virtualis Congress! Tu contenido es valioso para nosotros.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
