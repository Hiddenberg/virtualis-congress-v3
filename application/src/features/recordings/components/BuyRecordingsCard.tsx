import { Clock, ShieldCheck, VideoIcon } from "lucide-react";
import BuyRecordingsButton from "./BuyRecordingsButton";

interface BuyRecordingsCardProps {
   priceId?: string;
}

export default function BuyRecordingsCard({ priceId }: BuyRecordingsCardProps) {
   return (
      <div className="mx-auto w-full max-w-3xl">
         <div className="bg-gradient-to-br from-blue-50 to-white shadow-sm p-6 md:p-8 border border-blue-100 rounded-2xl">
            <div className="flex justify-center items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12 text-blue-700">
                  <VideoIcon className="w-6 h-6" />
               </div>
               <h1 className="font-bold text-slate-800 text-2xl md:text-3xl">
                  Acceso a grabaciones
               </h1>
            </div>
            <p className="mb-6 text-slate-600 text-base md:text-lg text-center">
               Obtén acceso a las grabaciones del congreso para ver las
               ponencias cuando quieras.
            </p>

            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 mb-6">
               <div className="flex items-center gap-2 bg-white/70 px-4 py-3 border border-blue-100 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-700" />
                  <span className="text-slate-700 text-sm">
                     Acceso bajo demanda
                  </span>
               </div>
               <div className="flex items-center gap-2 bg-white/70 px-4 py-3 border border-blue-100 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <span className="text-slate-700 text-sm">
                     Compra segura con Stripe
                  </span>
               </div>
               {/* <div className="flex items-center gap-2 bg-white/70 px-4 py-3 border border-blue-100 rounded-xl">
                  <BadgeDollarSign className="w-5 h-5 text-blue-700" />
                  <span className="text-slate-700 text-sm">Promociones disponibles</span>
               </div> */}
            </div>

            <BuyRecordingsButton
               priceId={priceId}
               className="!bg-blue-600 hover:!bg-blue-700 mx-auto"
            />

            <p className="mt-4 text-slate-500 text-sm text-center">
               Recibirás un correo con el acceso una vez confirmado el pago.
            </p>
         </div>
      </div>
   );
}
