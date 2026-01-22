"use client";

import { CreditCard, Film, Globe, LockIcon, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import HelpButton from "@/features/userSupport/components/HelpButton";
import { getHGEACheckoutLinkAction } from "../serverActions/organizationPaymentActions";

export default function HGEAPaymentForm() {
   const [isLoading, startTransition] = useTransition();
   const router = useRouter();

   const handleProceed = () => {
      startTransition(async () => {
         const res = await getHGEACheckoutLinkAction();
         if (!res.success) {
            toast.error(res.errorMessage);
            return;
         }
         router.push(res.data.checkoutLink);
      });
   };

   return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
         <div className="flex justify-center pb-2">
            <HelpButton />
         </div>

         {/* Pricing glance */}
         <div className="gap-3 sm:gap-4 md:gap-6 grid md:grid-cols-3">
            <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl text-center">
               <div className="flex justify-center items-center bg-linear-to-br from-blue-500 to-blue-600 mx-auto mb-2 sm:mb-3 rounded-full w-10 sm:w-12 h-10 sm:h-12">
                  <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
               </div>
               <div className="font-bold text-gray-900 text-xl sm:text-2xl">$500 MXN</div>
               <div className="text-gray-600 text-xs sm:text-sm">Participantes en México</div>
            </div>
            <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl text-center">
               <div className="flex justify-center items-center bg-linear-to-br from-indigo-500 to-indigo-600 mx-auto mb-2 sm:mb-3 rounded-full w-10 sm:w-12 h-10 sm:h-12">
                  <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
               </div>
               <div className="font-bold text-gray-900 text-xl sm:text-2xl">$30 USD</div>
               <div className="text-gray-600 text-xs sm:text-sm">Participantes extranjeros</div>
            </div>
            <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl text-center">
               <div className="flex justify-center items-center bg-linear-to-br from-pink-500 to-rose-600 mx-auto mb-2 sm:mb-3 rounded-full w-10 sm:w-12 h-10 sm:h-12">
                  <Video className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
               </div>
               <div className="font-bold text-gray-900 text-xl sm:text-2xl">En línea</div>
               <div className="text-gray-600 text-xs sm:text-sm">
                  Transmisión + <span className="font-semibold text-gray-800">Grabaciones</span>
               </div>
               <div className="flex justify-center items-center gap-2 mt-2 text-rose-600 text-xs">
                  <Film className="w-3 sm:w-4 h-3 sm:h-4" /> Incluidas
               </div>
            </div>
         </div>

         {/* CTA */}
         <div className="bg-white shadow-lg p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
            <div className="flex justify-between items-start sm:items-center gap-2 bg-blue-50 mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg">
               <div className="flex-1 min-w-0 text-gray-800 text-xs sm:text-sm">
                  La moneda se seleccionará automáticamente en la platforma de pago según tu ubicación.
               </div>
               <div className="flex shrink-0 justify-center items-center bg-green-100 rounded-full w-6 sm:w-7 h-6 sm:h-7">
                  <LockIcon className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
               </div>
            </div>

            <Button
               variant="none"
               onClick={handleProceed}
               loading={isLoading}
               className="bg-linear-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl !w-full font-bold text-white text-base sm:text-lg transition-all duration-300"
            >
               {isLoading ? "Procesando Pago..." : "Proceder al Pago"}
            </Button>
            <p className="mt-2 sm:mt-3 text-gray-500 text-xs text-center">
               Al continuar, aceptas nuestros términos y condiciones
            </p>
         </div>
      </div>
   );
}
