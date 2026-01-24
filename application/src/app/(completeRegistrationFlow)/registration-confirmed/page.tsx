import { ArrowRight, CheckCircle, User } from "lucide-react";
import Link from "next/link";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default async function RegistrationConfirmedPage() {
   return (
      <div className="flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 p-2 sm:p-4 w-full min-h-screen">
         <div className="bg-white shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-200 rounded-xl sm:rounded-2xl w-full max-w-2xl">
            {/* Success Icon */}
            <div className="space-y-2 mb-4 sm:mb-8 text-center">
               <div className="inline-flex justify-center items-center bg-linear-to-br from-green-500 to-green-600 mb-2 sm:mb-6 rounded-full size-14 md:size-18">
                  <CheckCircle className="size-8 md:size-12 text-white" />
               </div>

               <h1 className="mb-2 px-2 font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
                  ¡Cuenta Creada Exitosamente!
               </h1>

               <p className="text-gray-600 text-base sm:text-lg">
                  Solo faltan unos pasos más para completar tu inscripción al congreso.
               </p>

               <div className="flex justify-center sm:py-4">
                  <HelpButton />
               </div>
            </div>

            {/* Next Steps */}
            <div className="mb-2 sm:mb-8">
               <h2 className="mb-2 md:mb-6 font-bold text-gray-800 text-xl md:text-2xl text-center">Próximos Pasos</h2>
            </div>

            {/* Important Note */}
            <div className="bg-linear-to-r from-amber-50 to-orange-50 mb-2 sm:mb-8 p-4 sm:p-6 border border-amber-200 rounded-lg sm:rounded-xl">
               <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex justify-center items-center bg-amber-500 mt-0.5 rounded-full w-5 sm:w-6 h-5 sm:h-6 shrink-0">
                     <span className="font-bold text-white text-xs">!</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="mb-1 sm:mb-2 font-semibold text-amber-800 text-sm sm:text-base">Información Importante</h4>
                     <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                        Tu inscripción al congreso <strong>no estará completa hasta que realices el pago</strong>. Te recomendamos
                        completar este proceso lo antes posible para asegurar tu lugar, ya que los cupos pueden ser limitados.
                     </p>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-4">
               <Link
                  href={"/payment"}
                  className="flex justify-center items-center gap-2 sm:gap-3 bg-linear-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl w-full font-bold text-white text-base sm:text-lg hover:scale-105 transition-all duration-300 transform"
               >
                  <User className="w-4 sm:w-5 h-4 sm:h-5" />
                  Ir a la sección de pago
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
               </Link>
            </div>

            {/* Footer Message */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-gray-200 border-t text-center">
               <p className="px-2 text-gray-500 text-xs sm:text-sm">
                  ¿Tienes dudas sobre el proceso? No dudes en contactarnos para recibir asistencia.
               </p>
            </div>
         </div>
      </div>
   );
}
