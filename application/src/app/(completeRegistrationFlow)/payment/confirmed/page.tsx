import {
   ArrowRight,
   Calendar,
   CheckCircle,
   CreditCard,
   Download,
   // Star,
   Home,
   Mail,
   Users,
   Video,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import {
   checkIfUserHasAccessToRecordings,
   getUserPurchasedModality,
} from "@/features/organizationPayments/services/userPurchaseServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default async function PaymentConfirmationPage() {
   const congress = await getLatestCongress();
   const userId = await getLoggedInUserId();
   const [paymentConfirmed, attendantModality, hasAccessToRecordings] = await Promise.all([
      confirmUserCongressPayment(userId ?? ""),
      getUserPurchasedModality(userId ?? "", congress.id),
      checkIfUserHasAccessToRecordings(userId ?? "", congress.id),
   ]);

   if (!paymentConfirmed) {
      return redirect("/registration-confirmed");
   }

   if (!congress) {
      throw new Error("Congress not found");
   }

   if (!attendantModality) {
      throw new Error("Attendant modality not found");
   }

   return (
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-2 sm:px-4 py-6 sm:py-8 md:py-12 min-h-screen">
         <div className="mx-auto max-w-2xl">
            {/* Success Animation & Header */}
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="inline-block relative">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 animate-pulse">
                     <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  {/* Celebration sparkles */}
                  <div className="-top-2 -right-2 absolute bg-yellow-400 rounded-full w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
                  <div className="-bottom-1 -left-3 absolute bg-blue-400 rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 animate-bounce delay-150" />
                  <div className="top-4 -left-4 absolute bg-pink-400 rounded-full w-2 h-2 animate-bounce delay-300" />
               </div>

               <h1 className="mb-2 sm:mb-3 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl px-2">¡Pago Confirmado!</h1>
               <p className="mb-2 text-gray-600 text-base sm:text-lg px-2">
                  Tu registro al congreso ha sido procesado exitosamente
               </p>
               <div className="flex justify-center items-center gap-2 text-green-700 text-xs sm:text-sm">
                  <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
                  <span>Confirmación procesada</span>
               </div>
            </div>

            {/* Main Confirmation Card */}
            <div className="bg-white shadow-lg mb-4 sm:mb-6 border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
               {/* Header with gradient */}
               <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                     <Calendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                     <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-lg sm:text-xl">{congress.title}</h2>
                        <p className="text-green-100 text-xs sm:text-sm">Congreso Hibrido</p>
                     </div>
                  </div>
               </div>

               {/* Registration Details */}
               <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="bg-green-50 p-3 sm:p-4 border border-green-200 rounded-lg">
                     <div className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <div className="min-w-0 flex-1">
                           <h3 className="mb-1 font-semibold text-green-800 text-sm sm:text-base">Registro Completado</h3>
                           <p className="text-green-700 text-xs sm:text-sm">
                              Tu plaza en el congreso ha sido confirmada. Recibirás un correo de confirmación en los próximos
                              minutos.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="pt-4 sm:pt-6 border-gray-200 border-t">
                     <h3 className="flex items-center gap-2 mb-3 sm:mb-4 font-semibold text-gray-900 text-base sm:text-lg">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        Resumen de Compra
                     </h3>
                     <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center py-2 gap-2">
                           <span className="text-gray-600 text-xs sm:text-sm">Estado del pago:</span>
                           <div className="flex items-center gap-2">
                              <div className="bg-green-500 rounded-full w-2 h-2 flex-shrink-0" />
                              <span className="font-medium text-green-700 text-xs sm:text-sm">Pagado</span>
                           </div>
                        </div>
                        <div className="flex justify-between items-center py-2 gap-2">
                           <span className="text-gray-600 text-xs sm:text-sm">Modalidad de asistencia:</span>
                           <span className="font-medium text-gray-900 text-xs sm:text-sm">
                              {attendantModality === "virtual" ? "Virtual" : "Presencial"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-2 gap-2">
                           <span className="text-gray-600 text-xs sm:text-sm">Acceso a grabaciones:</span>
                           <div className="flex items-center gap-2">
                              {hasAccessToRecordings ? (
                                 <>
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                    <span className="font-medium text-green-700 text-xs sm:text-sm">Incluido</span>
                                 </>
                              ) : (
                                 <>
                                    <Video className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium text-gray-500 text-xs sm:text-sm">No incluido</span>
                                 </>
                              )}
                           </div>
                        </div>
                        {/* <div className="flex justify-between items-center py-2 border-gray-100 border-t">
                           <span className="text-gray-600">Fecha de confirmación:</span>
                           <span className="font-medium text-gray-900">
                              {new Date()
                                 .toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                 })}
                           </span>
                        </div> */}
                     </div>
                  </div>
               </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white shadow-lg mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl">
               <h3 className="flex items-center gap-2 mb-3 sm:mb-4 font-semibold text-gray-900 text-base sm:text-lg">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  Próximos Pasos
               </h3>
               <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 p-3 rounded-lg">
                     <Mail className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-blue-900 text-sm sm:text-base">Revisa tu correo electrónico</h4>
                        <p className="mt-1 text-blue-700 text-xs sm:text-sm">
                           Recibirás información detallada sobre el congreso, ubicación, horarios y material adicional.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-purple-50 p-3 rounded-lg">
                     <Users className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-purple-900 text-sm sm:text-base">Acceso a la plataforma</h4>
                        <p className="mt-1 text-purple-700 text-xs sm:text-sm">
                           Tu cuenta ya tiene acceso completo a todas las sesiones y materiales del congreso.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-amber-50 p-3 rounded-lg">
                     <Download className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-amber-900 text-sm sm:text-base">Certificados</h4>
                        <p className="mt-1 text-amber-700 text-xs sm:text-sm">
                           Los certificados de participación estarán disponibles al finalizar el congreso.
                        </p>
                     </div>
                  </div>

                  {hasAccessToRecordings && (
                     <div className="flex items-start gap-2 sm:gap-3 bg-indigo-50 p-3 rounded-lg">
                        <Video className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <div className="min-w-0 flex-1">
                           <h4 className="font-medium text-indigo-900 text-sm sm:text-base">Acceso a Grabaciones</h4>
                           <p className="mt-1 text-indigo-700 text-xs sm:text-sm">
                              Tendrás acceso a todas las grabaciones de las sesiones del congreso. Estas estarán disponibles en tu
                              cuenta después del evento.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-row flex-col gap-3 sm:gap-4">
               <Link
                  href="/lobby"
                  className="flex flex-1 justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-white text-sm sm:text-base transition-colors"
               >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  Ir al Lobby del Congreso
               </Link>

               {/* <Link
                  href="/certificates"
                  className="flex flex-1 justify-center items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
               >
                  <Star className="w-4 h-4" />
                  Ver Certificados
               </Link> */}
            </div>

            {/* Support Information */}
            <div className="mt-6 sm:mt-8 text-center">
               <div className="bg-gray-50 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h4 className="mb-2 font-medium text-gray-900 text-sm sm:text-base">¿Necesitas ayuda?</h4>
                  <p className="mb-3 text-gray-600 text-xs sm:text-sm px-2">
                     Si tienes alguna pregunta sobre tu registro o el congreso, no dudes en contactarnos.
                  </p>
                  <div className="flex sm:flex-row flex-col justify-center gap-2 text-sm">
                     <HelpButton />
                  </div>
               </div>
            </div>

            {/* Footer Message */}
            <div className="mt-4 sm:mt-6 text-center">
               <p className="text-gray-500 text-xs sm:text-sm px-2">
                  Gracias por formar parte del XXIX Congreso Anual de Medicina Interna Costa de Chiapas
               </p>
            </div>
         </div>
      </div>
   );
}
