import { FileQuestion } from "lucide-react";
import GoBackButton from "@/components/global/GoBackButton";
import PresentationViewer from "@/features/pptPresentations/components/PresentationShower";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import DeleteRecordingPresentationWPopupButton from "@/features/simpleRecordings/components/DeleteRecordingPresentationWPopupButton";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";
import { getSimpleRecordingById } from "@/features/simpleRecordings/services/recordingsServices";

export default async function RecordingPresentationPage({
   params,
}: {
   params: Promise<{ recordingId: string }>;
}) {
   const { recordingId } = await params;

   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
            <div className="flex flex-col items-center gap-6 bg-white shadow-md p-8 border border-gray-200 rounded-xl text-center">
               <div className="flex justify-center items-center bg-gray-100 rounded-full w-16 h-16">
                  <FileQuestion className="w-8 h-8 text-gray-400" />
               </div>
               <div className="space-y-2">
                  <h1 className="font-bold text-gray-900 text-2xl">
                     Grabación no encontrada
                  </h1>
                  <p className="text-gray-600">
                     La grabación que buscas no existe o no tienes acceso a
                     ella.
                  </p>
               </div>
               <GoBackButton
                  backButtonText="Volver a las grabaciones"
                  backURL={`/recordings`}
               />
            </div>
         </div>
      );
   }

   const recordingPresentation =
      await getRecordingPresentationByRecordingId(recordingId);

   if (!recordingPresentation) {
      return (
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
            <div className="flex flex-col items-center gap-6 bg-white shadow-md p-8 border border-gray-200 rounded-xl text-center">
               <div className="flex justify-center items-center bg-gray-100 rounded-full w-16 h-16">
                  <FileQuestion className="w-8 h-8 text-gray-400" />
               </div>
               <div className="space-y-2">
                  <h1 className="font-bold text-gray-900 text-2xl">
                     Presentación no encontrada
                  </h1>
                  <p className="text-gray-600">
                     Esta grabación no tiene una presentación asociada.
                  </p>
               </div>
               <GoBackButton
                  backButtonText="Volver a las grabaciones"
                  backURL={`/recordings/campaign/${recording.campaign}`}
               />
            </div>
         </div>
      );
   }

   const recordingPresentationSlides = await getPresentationSlidesById(
      recordingPresentation.id,
   );

   return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
         {/* Header Section */}
         <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-col gap-2">
               <GoBackButton
                  backButtonText="Volver a las grabaciones"
                  backURL={`/recordings/campaign/${recording.campaign}`}
               />
            </div>

            <DeleteRecordingPresentationWPopupButton
               recordingId={recordingId}
            />
         </div>

         {/* Title Section */}
         <div className="space-y-2 mb-8">
            <h1 className="font-bold text-gray-900 text-3xl">
               Presentación de la grabación
            </h1>
            <p className="text-gray-600 text-lg">{recording.title}</p>
         </div>

         {/* Presentation Viewer */}
         <div className="mb-8">
            <PresentationViewer
               presentationSlides={recordingPresentationSlides}
            />
         </div>
      </div>
   );
}
