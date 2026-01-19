import {
   CreditCard,
   HelpCircle,
   // Home,
   Mail,
   RefreshCw,
   XCircle,
} from "lucide-react";
import Link from "next/link";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default function PaymentCanceledPage() {
   return (
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-2 sm:px-4 py-6 sm:py-8 md:py-12 min-h-screen">
         <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-red-100 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20">
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
               </div>

               <h1 className="mb-2 sm:mb-3 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl px-2">
                  Pago Cancelado
               </h1>
               <p className="mb-2 text-gray-600 text-base sm:text-lg px-2">
                  Tu pago no ha sido procesado
               </p>
               <div className="flex justify-center items-center gap-2 text-red-700 text-xs sm:text-sm">
                  <div className="bg-red-500 rounded-full w-2 h-2" />
                  <span>Transacción cancelada</span>
               </div>
            </div>

            {/* Main Information Card */}
            <div className="bg-white shadow-lg mb-4 sm:mb-6 border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                     <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                     <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-lg sm:text-xl">
                           Proceso de Pago Interrumpido
                        </h2>
                        <p className="text-red-100 text-xs sm:text-sm">
                           No se ha realizado ningún cargo
                        </p>
                     </div>
                  </div>
               </div>

               {/* Information */}
               <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="bg-orange-50 p-3 sm:p-4 border border-orange-200 rounded-lg">
                     <div className="flex items-start gap-2 sm:gap-3">
                        <XCircle className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <div className="min-w-0 flex-1">
                           <h3 className="mb-1 font-semibold text-orange-800 text-sm sm:text-base">
                              Pago No Completado
                           </h3>
                           <p className="text-orange-700 text-xs sm:text-sm">
                              El proceso de pago fue cancelado y no se ha
                              realizado ningún cargo a tu método de pago.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Possible Reasons */}
                  <div className="pt-4 sm:pt-6 border-gray-200 border-t">
                     <h3 className="flex items-center gap-2 mb-3 sm:mb-4 font-semibold text-gray-900 text-base sm:text-lg">
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        Posibles Razones
                     </h3>
                     <div className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                           <div className="flex-shrink-0 bg-gray-400 mt-2 rounded-full w-1.5 h-1.5" />
                           <span>
                              Cancelaste el proceso de pago voluntariamente
                           </span>
                        </div>
                        <div className="flex items-start gap-2">
                           <div className="flex-shrink-0 bg-gray-400 mt-2 rounded-full w-1.5 h-1.5" />
                           <span>
                              Hubo un problema de conexión durante el proceso
                           </span>
                        </div>
                        <div className="flex items-start gap-2">
                           <div className="flex-shrink-0 bg-gray-400 mt-2 rounded-full w-1.5 h-1.5" />
                           <span>El navegador se cerró inesperadamente</span>
                        </div>
                        <div className="flex items-start gap-2">
                           <div className="flex-shrink-0 bg-gray-400 mt-2 rounded-full w-1.5 h-1.5" />
                           <span>
                              Decidiste revisar más información antes de
                              proceder
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white shadow-lg mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl">
               <h3 className="flex items-center gap-2 mb-3 sm:mb-4 font-semibold text-gray-900 text-base sm:text-lg">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  ¿Qué puedes hacer ahora?
               </h3>
               <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3 bg-green-50 p-3 rounded-lg">
                     <CreditCard className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-green-900 text-sm sm:text-base">
                           Intentar el pago nuevamente
                        </h4>
                        <p className="mt-1 text-green-700 text-xs sm:text-sm">
                           Puedes volver a la página de pago y completar tu
                           registro cuando estés listo.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 p-3 rounded-lg">
                     <HelpCircle className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                           Revisar información del congreso
                        </h4>
                        <p className="mt-1 text-blue-700 text-xs sm:text-sm">
                           Consulta todos los detalles sobre modalidades,
                           precios y beneficios incluidos.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-purple-50 p-3 rounded-lg">
                     <Mail className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-purple-900 text-sm sm:text-base">
                           Contactar soporte
                        </h4>
                        <p className="mt-1 text-purple-700 text-xs sm:text-sm">
                           Si experimentaste algún problema técnico, nuestro
                           equipo puede ayudarte.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-row flex-col gap-3 sm:gap-4">
               <Link
                  href="/payment"
                  className="flex flex-1 justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-white text-sm sm:text-base transition-colors"
               >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  Intentar Pago Nuevamente
               </Link>

               {/* <Link
                  href="/"
                  className="flex flex-1 justify-center items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
               >
                  <Home className="w-4 h-4" />
                  Volver al Inicio
               </Link> */}
            </div>

            {/* Support Information */}
            <div className="mt-6 sm:mt-8 text-center">
               <div className="bg-gray-50 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-900 text-sm sm:text-base">
                     ¿Necesitas ayuda?
                  </h4>
                  <p className="mb-3 text-gray-600 text-xs sm:text-sm px-2">
                     Si tienes problemas con el proceso de pago o necesitas
                     asistencia, estamos aquí para ayudarte.
                  </p>
                  <div className="flex sm:flex-row flex-col justify-center gap-2 text-sm">
                     <HelpButton />
                  </div>
               </div>
            </div>

            {/* Reassuring Message */}
            <div className="mt-4 sm:mt-6 text-center">
               <p className="text-gray-500 text-xs sm:text-sm px-2">
                  Recuerda: Tu lugar en el congreso estará disponible cuando
                  completes el registro
               </p>
            </div>
         </div>
      </div>
   );
}
