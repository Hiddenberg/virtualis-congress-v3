import { ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";

export default async function UploadedPresentationPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conferencePresentation = await getConferencePresentation(conferenceId);

   if (!conferencePresentation) {
      return redirect(`/preparation/${conferenceId}/presentation/upload`);
   }

   return (
      <div className="flex justify-center items-center p-6 min-h-[60vh]">
         <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-2xl w-full max-w-lg text-center">
            <div className="flex justify-center items-center bg-green-50 mx-auto mb-4 rounded-full w-14 h-14">
               <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="mb-2 font-bold text-gray-900 text-2xl">¡Presentación subida correctamente!</h1>
            <p className="text-gray-600">
               Gracias por compartir tus materiales. Tu presentación quedó registrada para tu conferencia como:
            </p>
            <p className="mt-2 font-medium text-gray-900 truncate">{conferencePresentation.name}</p>

            <div className="mt-6 pt-6 border-gray-200 border-t text-left">
               <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl">
                  <div className="flex items-start gap-3">
                     <div className="bg-blue-50 p-2 rounded-md">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                     </div>
                     <div className="flex-1">
                        <h2 className="mb-1 font-semibold text-gray-900 text-lg">
                           ¿Te gustaría agregar una encuesta de preguntas?
                        </h2>
                        <p className="text-gray-600">
                           Las encuestas ayudan a interactuar con la audiencia durante tu conferencia.
                        </p>
                        <div className="flex sm:flex-row flex-col sm:items-center gap-3 mt-4">
                           <LinkButton href={`/preparation/${conferenceId}/question-polls`} variant="blue" className="">
                              Ir a encuestas <ArrowRight className="w-4 h-4" />
                           </LinkButton>
                        </div>
                        <p className="mt-3 text-gray-500 text-sm">
                           Si no deseas hacerlo ahora, puedes cerrar esta ventana manualmente.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
