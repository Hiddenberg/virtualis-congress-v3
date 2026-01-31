import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

function getSpeakerDisplayName(speaker: { displayName: string; academicTitle?: string }) {
   if (speaker.academicTitle) {
      return `${speaker.academicTitle} ${speaker.displayName}`;
   }
   return speaker.displayName;
}

export default async function SpeakerSlidesUploadConfirmationPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const [conference, congress, speakers] = await Promise.all([
      getConferenceById(conferenceId),
      getLatestCongress(),
      getConferenceSpeakers(conferenceId),
   ]);

   if (!conference) {
      return (
         <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="mx-auto max-w-4xl">
               <div className="bg-white p-6 border border-gray-200 rounded-xl">
                  <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
               </div>
            </div>
         </div>
      );
   }

   const speakerNames = speakers.map((speaker) => getSpeakerDisplayName(speaker));

   return (
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
         <div className="mx-auto max-w-4xl">
            <Link
               href="/speakers/slides"
               className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               Volver a la lista de conferencias
            </Link>

            <div className="bg-white p-8 border border-gray-200 rounded-xl">
               <div className="flex justify-center mb-6">
                  <div className="flex justify-center items-center bg-green-100 rounded-full w-16 h-16">
                     <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
               </div>

               <div className="mb-6 text-center">
                  <h1 className="mb-4 font-bold text-gray-900 text-2xl md:text-3xl">¡Presentación subida exitosamente!</h1>
                  <p className="text-gray-600">
                     Tu archivo ha sido subido correctamente y está disponible para la conferencia.
                  </p>
               </div>

               <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-6">
                  <h3 className="mb-4 font-bold text-gray-900 text-lg">{conference.title}</h3>
                  <div className="space-y-2">
                     <div>
                        <span className="font-semibold text-gray-700">Congreso:</span> <span className="text-gray-900">{congress.title}</span>
                     </div>
                     {speakerNames.length > 0 && (
                        <div>
                           <span className="font-semibold text-gray-700">Ponente(s):</span>{" "}
                           <span className="text-gray-900">{speakerNames.join(", ")}</span>
                        </div>
                     )}
                  </div>
               </div>

               <p className="font-semibold text-gray-600 text-lg text-center">Ya puedes cerrar esta página.</p>
            </div>
         </div>
      </div>
   );
}
