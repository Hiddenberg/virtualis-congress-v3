import { AlertCircle, PresentationIcon } from "lucide-react";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonStateServices";
import RealtimePresentationController from "@/features/pptPresentations/components/realtime/RealtimePresentationController";

export default async function PresentationControllerPage() {
   const currentConferencec = await ensuredCongressInPersonState();

   if (!currentConferencec.activeConference) {
      return (
         <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
               <div className="bg-gray-300 w-px h-6" />
               <h1 className="flex items-center gap-2 font-bold text-gray-900 text-2xl">
                  <PresentationIcon className="w-6 h-6 text-blue-600" />
                  Control de Presentación
               </h1>
            </div>

            {/* No active conference state */}
            <div className="flex flex-col justify-center items-center bg-white p-12 border border-gray-200 rounded-xl min-h-[400px] text-center">
               <div className="flex justify-center items-center bg-yellow-50 mb-6 rounded-full w-16 h-16">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
               </div>
               <h2 className="mb-3 font-semibold text-gray-900 text-xl">No hay una conferencia activa</h2>
               <p className="mb-6 max-w-md text-gray-600 text-sm">
                  Para usar el control de presentación, primero debe haber una conferencia activa en el sistema.
               </p>
            </div>
         </div>
      );
   }

   const conferencePresentation = await getConferencePresentation(currentConferencec.activeConference);

   if (!conferencePresentation) {
      return (
         <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
               <h1 className="flex items-center gap-2 font-bold text-gray-900 text-2xl">
                  <PresentationIcon className="w-6 h-6 text-blue-600" />
                  Control de Presentación
               </h1>
            </div>

            {/* No presentation state */}
            <div className="flex flex-col justify-center items-center bg-white p-12 border border-gray-200 rounded-xl min-h-[400px] text-center">
               <div className="flex justify-center items-center bg-blue-50 mb-6 rounded-full w-16 h-16">
                  <PresentationIcon className="w-8 h-8 text-blue-600" />
               </div>
               <h2 className="mb-3 font-semibold text-gray-900 text-xl">No hay una presentación configurada</h2>
               <p className="mb-6 max-w-md text-gray-600 text-sm">
                  La conferencia activa no tiene una presentación asignada. Configure una presentación para poder controlarla
                  desde aquí.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="">
         {/* Header */}
         <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-300 w-px h-6" />
            <h1 className="flex items-center gap-2 font-bold text-gray-900 text-2xl">
               <PresentationIcon className="w-6 h-6 text-blue-600" />
               Control de Presentación
            </h1>
         </div>

         {/* Presentation Controller */}
         <div className="space-y-6">
            <RealtimePresentationController presentationId={conferencePresentation.id} />
         </div>
      </div>
   );
}
