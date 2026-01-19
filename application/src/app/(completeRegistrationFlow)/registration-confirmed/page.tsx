import {
   ArrowRight,
   Calendar,
   Calendar1Icon,
   CheckCircle,
   CreditCard,
   type LucideIcon,
   User,
} from "lucide-react";
import Link from "next/link";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import HelpButton from "@/features/userSupport/components/HelpButton";

interface NextStep {
   title: string;
   description: string;
   icon: LucideIcon;
}

const organizationNextSteps: Record<string, NextStep[]> = {
   CMIMCC: [
      {
         title: "Selecciona tu perfil profesional",
         description: "Selecciona tu perfil profesional.",
         icon: User,
      },
      {
         title: "Realiza tu Pago",
         description: "Realiza tu Pago.",
         icon: CreditCard,
      },
      {
         title: "¡Disfruta el Congreso!",
         description: "¡Disfruta el Congreso!",
         icon: Calendar,
      },
   ],
   HGEA: [
      {
         title: "Realiza tu Pago",
         description: "Realiza tu Pago.",
         icon: CreditCard,
      },
      {
         title: "¡Disfruta el Congreso!",
         description: "¡Disfruta el Congreso!",
         icon: Calendar,
      },
   ],
} as const;

const organizaztionContinueLink: Record<string, string> = {
   CMIMCC: "/profile",
   "ACP-MX": "/payment",
   HGEA: "/payment",
};

export default async function RegistrationConfirmedPage() {
   const organization = await getOrganizationFromSubdomain();

   const nextSteps = organizationNextSteps[organization.shortID] ?? [];

   return (
      <div className="flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 w-full min-h-screen">
         <div className="bg-white shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-200 rounded-xl sm:rounded-2xl w-full max-w-2xl">
            {/* Success Icon */}
            <div className="space-y-2 mb-4 sm:mb-8 text-center">
               <div className="inline-flex justify-center items-center bg-gradient-to-br from-green-500 to-green-600 mb-2 sm:mb-6 rounded-full size-14 md:size-18">
                  <CheckCircle className="size-8 md:size-12 text-white" />
               </div>

               <h1 className="mb-2 px-2 font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
                  ¡Cuenta Creada Exitosamente!
               </h1>

               <p className="text-gray-600 text-base sm:text-lg">
                  {/* Tu cuenta ha sido registrada correctamente en nuestra plataforma. */}
                  Solo faltan unos pasos más para completar tu inscripción al
                  congreso.
               </p>

               <div className="flex justify-center sm:py-4">
                  <HelpButton />
               </div>
            </div>

            {/* Next Steps */}
            <div className="mb-2 sm:mb-8">
               <h2 className="mb-2 md:mb-6 font-bold text-gray-800 text-xl md:text-2xl text-center">
                  Próximos Pasos
               </h2>

               {nextSteps.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                     {nextSteps.map((step, index) => (
                        <div
                           key={step.title}
                           className="flex items-start gap-3 sm:gap-4 bg-blue-50 p-3 sm:p-4 border border-blue-200 rounded-lg sm:rounded-xl"
                        >
                           <div className="flex flex-shrink-0 justify-center items-center bg-blue-600 rounded-full w-7 sm:w-8 h-7 sm:h-8">
                              <span className="font-bold text-white text-xs sm:text-sm">
                                 {index + 1}
                              </span>
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                 <step.icon className="flex-shrink-0 w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                                 <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                    {step.title}
                                 </h3>
                              </div>
                              <p className="text-gray-700 text-xs sm:text-sm">
                                 {step.description}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 mb-2 sm:mb-8 p-4 sm:p-6 border border-amber-200 rounded-lg sm:rounded-xl">
               <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex flex-shrink-0 justify-center items-center bg-amber-500 mt-0.5 rounded-full w-5 sm:w-6 h-5 sm:h-6">
                     <span className="font-bold text-white text-xs">!</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="mb-1 sm:mb-2 font-semibold text-amber-800 text-sm sm:text-base">
                        Información Importante
                     </h4>
                     <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                        Tu inscripción al congreso{" "}
                        <strong>
                           no estará completa hasta que realices el pago
                        </strong>
                        . Te recomendamos completar este proceso lo antes
                        posible para asegurar tu lugar, ya que los cupos pueden
                        ser limitados.
                     </p>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-4">
               <Link
                  href={
                     organizaztionContinueLink[organization.shortID] ??
                     "/profile"
                  }
                  className="flex justify-center items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl w-full font-bold text-white text-base sm:text-lg hover:scale-105 transition-all duration-300 transform"
               >
                  <User className="w-4 sm:w-5 h-4 sm:h-5" />
                  Ir a la sección de pago
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
               </Link>

               {organization.shortID === "CMIMCC" && (
                  <Link
                     href="/CMIMCC/files/programa-CMIMCC.pdf"
                     target="_blank"
                     className="flex justify-center items-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl w-full font-bold text-white text-base sm:text-lg hover:scale-105 transition-all duration-300 transform"
                  >
                     <Calendar1Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                     Ver Programa
                     <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
               )}
            </div>

            {/* Footer Message */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-gray-200 border-t text-center">
               <p className="px-2 text-gray-500 text-xs sm:text-sm">
                  ¿Tienes dudas sobre el proceso? No dudes en contactarnos para
                  recibir asistencia.
               </p>
            </div>
         </div>
      </div>
   );
}
