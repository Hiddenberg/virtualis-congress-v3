import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function SpeakerSlidesUploadConfirmationPage() {
   return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
               <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                     <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
               </div>
               <h1 className="mb-2 font-bold text-gray-900 text-2xl md:text-3xl">¡Presentación subida exitosamente!</h1>
               <p className="mb-6 text-gray-600">
                  Tu archivo ha sido subido correctamente y está disponible para la conferencia.
               </p>
               <Link
                  href="/speakers/slides"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la lista de conferencias
               </Link>
            </div>
         </div>
      </div>
   );
}
