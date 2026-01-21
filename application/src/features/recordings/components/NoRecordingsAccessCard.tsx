import { Lock } from "lucide-react";
import BuyRecordingsButton from "./BuyRecordingsButton";

export default function NoRecordingsAccessCard() {
   return (
      <div className="mx-auto w-full max-w-3xl">
         <div className="bg-gradient-to-br from-blue-50 to-white shadow-sm p-6 md:p-8 border border-blue-100 rounded-2xl">
            <div className="flex justify-center items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12 text-blue-700">
                  <Lock className="w-6 h-6" />
               </div>
               <h1 className="font-bold text-slate-800 text-2xl md:text-3xl">Sin acceso a grabaciones</h1>
            </div>
            <p className="mb-6 text-slate-600 text-base md:text-lg text-center">
               Para acceder a las grabaciones del congreso, adquiere tu acceso.
            </p>

            <div className="flex justify-center">
               <div className="w-full sm:w-80">
                  <BuyRecordingsButton className="!bg-blue-600 hover:!bg-blue-700" />
               </div>
            </div>

            <p className="mt-4 text-slate-500 text-sm text-center">
               Si ya compraste, serás redirigido automáticamente después del pago.
            </p>
         </div>
      </div>
   );
}
