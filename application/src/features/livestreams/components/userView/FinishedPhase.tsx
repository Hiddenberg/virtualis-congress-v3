"use client";

import { Calendar, CheckCircle2 } from "lucide-react";

// import { useParams } from "next/navigation"

interface FinishedPhaseProps {
   classTitle?: string;
}

export default function FinishedPhase({ classTitle = "Esta clase" }: FinishedPhaseProps) {
   // const { classId } = useParams()
   // const { organizationBasePath } = useOrganizationContext()

   return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 to-green-50 p-8 w-full min-h-[500px]">
         <div className="space-y-8 mx-auto w-full max-w-lg text-center">
            <div className="flex flex-col items-center space-y-4">
               <div className="bg-emerald-100 p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600" />
               </div>

               <h2 className="font-bold text-stone-900 text-2xl md:text-3xl">¡La clase ha finalizado!</h2>

               <p className="max-w-md text-stone-700 text-base md:text-lg">
                  Gracias por asistir a <span className="font-semibold text-emerald-700">{classTitle}</span>. Esperamos que hayas
                  disfrutado del contenido.
               </p>
            </div>

            {/* <div className="bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
               <div className="flex items-center gap-3 mb-2">
                  <Clock className="flex-shrink-0 w-5 h-5 text-amber-600" />
                  <p className="font-medium text-stone-700 text-sm">
                     Grabación disponible próximamente
                  </p>
               </div>
               <p className="text-stone-600 text-sm">
                  Las grabaciones de esta clase estarán disponibles próximamente. Te notificaremos cuando estén listas.
               </p>
            </div> */}

            {/* <div className="space-y-4 bg-white/70 backdrop-blur-sm p-6 border border-emerald-200 rounded-xl">
               <div className="flex justify-center items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <p className="font-medium text-stone-700">Certificado de participación</p>
               </div>
               <p className="mb-4 text-stone-600 text-sm">
                  Puedes descargar tu certificado de participación desde tu perfil
               </p>
               <LinkButton
                  href={`${organizationBasePath}/certificates/${classId}/new-certificate`}
                  variant="green"
                  className="mx-auto">
                  Descargar certificado
               </LinkButton>
            </div> */}

            <div className="pt-4 border-stone-200 border-t">
               <p className="mb-3 text-stone-600 text-sm">Asegúrate de no perderte nuestras próximas clases</p>
               <div className="flex justify-center items-center space-x-2 text-emerald-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Revisa tu calendario de clases</span>
               </div>
            </div>
         </div>
      </div>
   );
}
