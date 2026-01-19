import { Award, PartyPopper, VideoIcon } from "lucide-react";
import { LinkButton } from "../global/Buttons";

interface CongressEndedBannerProps {
   congress: CongressRecord;
   hasAccessToRecordings: boolean;
}

export default function CongressEndedBanner({
   congress,
   hasAccessToRecordings,
}: CongressEndedBannerProps) {
   return (
      <div className="flex flex-col justify-center items-center p-4 md:p-8">
         <div className="w-full max-w-3xl">
            <div className="bg-gradient-to-br from-blue-50 to-white shadow-sm p-6 md:p-8 border border-blue-100 rounded-2xl text-center">
               <div className="flex justify-center mb-4">
                  <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12 text-blue-700">
                     <PartyPopper className="w-6 h-6" />
                  </div>
               </div>
               <h1 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">
                  {congress.title}
               </h1>
               <p className="mb-4 font-semibold text-blue-800 text-lg md:text-xl">
                  ¡El congreso ha finalizado!
               </p>
               <p className="mb-6 text-slate-600 text-base md:text-lg">
                  ¡Felicitaciones por tu participación! Esperamos que hayas
                  disfrutado y aprendido mucho.
               </p>
               <p className="mb-6 text-slate-600 text-base md:text-lg">
                  Las grabaciones (si las solicitaste) ya están disponibles.
               </p>
               <div className="gap-3 grid grid-cols-1 *:w-full">
                  <LinkButton href="/certificates" variant="golden">
                     <Award className="w-5 h-5 text-yellow-800" />
                     Obtener mi certificado
                  </LinkButton>
                  {!hasAccessToRecordings ? (
                     <LinkButton href="/congress-recordings/buy" variant="blue">
                        <VideoIcon className="w-5 h-5 text-white" />
                        Comprar acceso a grabaciones
                     </LinkButton>
                  ) : (
                     <LinkButton href="/congress-recordings" variant="blue">
                        <VideoIcon className="w-5 h-5 text-white" />
                        Ir a grabaciones
                     </LinkButton>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
