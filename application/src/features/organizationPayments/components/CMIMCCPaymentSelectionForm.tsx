"use client";

import {
   BuildingIcon,
   CalendarIcon,
   CheckIcon,
   DollarSignIcon,
   LockIcon,
   type LucideIcon,
   MapPinIcon,
   MonitorIcon,
   PlayCircleIcon,
   UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import type { AttendanceModality } from "@/features/congresses/types/congressRegistrationTypes";
import HelpButton from "@/features/userSupport/components/HelpButton";
import { getCMIMCCCheckoutLinkAction } from "../serverActions/organizationPaymentActions";

interface PricingOption {
   modality: AttendanceModality;
   title: string;
   description: string;
   icon: LucideIcon;
   price: number;
   currency: string;
   features: string[];
   popular?: boolean;
}

export default function CMIMCCPaymentSelectionForm({
   userCategory,
   isInternational,
   userCategoryPrice,
}: {
   userCategory: string;
   isInternational: boolean;
   userCategoryPrice: number;
}) {
   const [selectedModality, setSelectedModality] =
      useState<AttendanceModality>("in-person");
   const [includeRecordings, setIncludeRecordings] = useState(false);
   const [gettingCheckoutLink, startTransition] = useTransition();

   const modalityOptions: PricingOption[] = [
      {
         modality: "in-person",
         title: "Modalidad Presencial",
         description: "Asiste físicamente al congreso en Tapachula",
         icon: BuildingIcon,
         price: isInternational ? 75 : userCategoryPrice,
         currency: isInternational ? "USD" : "MXN",
         features: [
            "Acceso completo a todas las conferencias",
            "Networking presencial con expertos",
            "Coffee breaks y comidas incluidas",
            "Material físico del congreso",
            "Certificado de participación",
         ],
      },
      {
         modality: "virtual",
         title: "Modalidad Virtual",
         description: "Participa desde cualquier lugar en línea",
         icon: MonitorIcon,
         price: 1500,
         currency: "MXN",
         features: [
            "Transmisión en vivo de todas las conferencias",
            "Chat interactivo con ponentes",
            "Material digital del congreso",
            "Certificado de participación digital",
            "Acceso desde cualquier dispositivo",
         ],
         popular: true,
      },
   ];

   const recordingsAddon = {
      price: 290,
      currency: "MXN",
      features: [
         "Acceso a todas las grabaciones por 3 meses",
         "Posibilidad de revisar contenido a tu ritmo",
         "Descargas offline de materiales",
         "Acceso desde múltiples dispositivos",
      ],
   };
   const selectedModalityData = modalityOptions.find(
      (option) => option.modality === selectedModality,
   );
   const navigate = useRouter();

   const calculateTotal = () => {
      if (!selectedModalityData) return 0;
      let total = selectedModalityData.price;
      if (includeRecordings) {
         total += recordingsAddon.price;
      }
      return total;
   };

   const handleCompletePayment = () => {
      startTransition(async () => {
         const checkoutLinkResponse = await getCMIMCCCheckoutLinkAction({
            attendanceModality: selectedModality,
            includeRecordings,
         });

         if (!checkoutLinkResponse.success) {
            toast.error(checkoutLinkResponse.errorMessage);
            return;
         }

         const checkoutLink = checkoutLinkResponse.data.checkoutLink;
         navigate.push(checkoutLink);
      });
   };

   return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
         <div className="flex justify-center pb-2 sm:pb-4">
            <HelpButton />
         </div>
         {/* User Category Info */}
         <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
            <h2 className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 font-bold text-gray-800 text-lg sm:text-xl">
               <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
               Tu Categoría Profesional
            </h2>
            <div className="bg-blue-50 p-3 sm:p-4 border border-blue-200 rounded-lg sm:rounded-xl">
               <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {userCategory}
               </p>
               {/* <p className="mt-1 text-gray-600 text-sm">
                           {isInternational ? "Precio especial para extranjeros" : "Categoría verificada y confirmada"}
                        </p> */}
            </div>
         </div>

         {/* Modality Selection */}
         <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
            <h2 className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 font-bold text-gray-800 text-lg sm:text-xl">
               <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
               Modalidad de Participación
            </h2>

            <div className="gap-3 sm:gap-4 grid md:grid-cols-2">
               {modalityOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedModality === option.modality;

                  return (
                     <div
                        key={option.modality}
                        onClick={() => setSelectedModality(option.modality)}
                        className={`relative cursor-pointer rounded-lg sm:rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                           isSelected
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                     >
                        {/* Selection Indicator */}
                        {isSelected && (
                           <div className="top-2 right-2 sm:top-4 sm:right-4 absolute">
                              <div className="flex justify-center items-center bg-blue-500 rounded-full w-5 h-5 sm:w-6 sm:h-6">
                                 <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                           </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                           <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                 <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                    {option.title}
                                 </h3>
                                 <p className="text-gray-600 text-xs sm:text-sm">
                                    {option.description}
                                 </p>
                              </div>
                           </div>

                           <div className="py-2 text-center">
                              <div className="font-bold text-gray-900 text-2xl sm:text-3xl">
                                 ${option.price} {option.currency}
                              </div>
                           </div>

                           <ul className="space-y-1.5 sm:space-y-2">
                              {option.features.map((feature, index) => (
                                 <li
                                    key={index}
                                    className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm"
                                 >
                                    <CheckIcon className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5" />
                                    <span>{feature}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Recordings Add-on */}
         <div className="bg-white shadow-sm p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
            <h2 className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 font-bold text-gray-800 text-lg sm:text-xl">
               <PlayCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
               Complementos Opcionales
            </h2>

            <div
               onClick={() => setIncludeRecordings(!includeRecordings)}
               className={`cursor-pointer rounded-lg sm:rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-md ${
                  includeRecordings
                     ? "border-purple-500 bg-purple-50"
                     : "border-gray-200 bg-white hover:border-gray-300"
               }`}
            >
               <div className="flex items-start gap-3 sm:gap-4">
                  <div
                     className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        includeRecordings
                           ? "bg-purple-500 border-purple-500"
                           : "border-gray-300"
                     }`}
                  >
                     {includeRecordings && (
                        <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-2 gap-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                           Acceso a Grabaciones
                        </h3>
                        <span className="font-bold text-gray-900 text-lg sm:text-xl whitespace-nowrap">
                           +${recordingsAddon.price} {recordingsAddon.currency}
                        </span>
                     </div>
                     <p className="mb-2 sm:mb-3 text-gray-600 text-xs sm:text-sm">
                        Obtén acceso completo a todas las grabaciones del
                        congreso por 3 meses
                     </p>
                     <ul className="space-y-1">
                        {recordingsAddon.features.map((feature, index) => (
                           <li
                              key={index}
                              className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm"
                           >
                              <CheckIcon className="flex-shrink-0 w-3 h-3 text-green-500 mt-0.5" />
                              <span>{feature}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         </div>

         {/* Summary Section - Moved to bottom */}
         {selectedModalityData && (
            <div className="bg-white shadow-lg p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
               <h3 className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 font-bold text-gray-800 text-lg sm:text-xl">
                  <DollarSignIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  Resumen de Pago
               </h3>

               <div className="gap-4 sm:gap-6 md:gap-8 grid md:grid-cols-2">
                  {/* Left - Event Info */}
                  <div className="space-y-3 sm:space-y-4">
                     <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="mb-2 font-semibold text-gray-800 text-sm sm:text-base">
                           XXIX Congreso Anual
                        </h4>
                        <div className="space-y-1 text-gray-600 text-xs sm:text-sm">
                           <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>5-6 Septiembre 2025</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>Hotel Holiday Inn Tapachula</span>
                           </div>
                        </div>
                     </div>

                     {/* Security Note */}
                     <div className="bg-green-50 p-2.5 sm:p-3 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                           <LockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                           <span className="font-medium text-green-800 text-xs sm:text-sm">
                              Pago 100% Seguro
                           </span>
                        </div>
                        <p className="mt-1 text-green-700 text-xs">
                           Tus datos están protegidos con encriptación SSL
                        </p>
                     </div>
                  </div>

                  {/* Right - Pricing Breakdown */}
                  <div className="space-y-3 sm:space-y-4">
                     <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center py-2 border-gray-200 border-b gap-2">
                           <span className="text-gray-700 text-xs sm:text-sm">
                              Categoría:
                           </span>
                           <span className="font-medium text-gray-900 text-xs sm:text-sm text-right">
                              {userCategory}
                           </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-gray-200 border-b gap-2">
                           <span className="text-gray-700 text-xs sm:text-sm">
                              {selectedModalityData.title}:
                           </span>
                           <span className="font-medium text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                              ${selectedModalityData.price}{" "}
                              {selectedModalityData.currency}
                           </span>
                        </div>

                        {includeRecordings && (
                           <div className="flex justify-between items-center py-2 border-gray-200 border-b gap-2">
                              <span className="text-gray-700 text-xs sm:text-sm">
                                 Grabaciones:
                              </span>
                              <span className="font-medium text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                                 +${recordingsAddon.price}{" "}
                                 {recordingsAddon.currency}
                              </span>
                           </div>
                        )}

                        <div className="flex justify-between items-center bg-blue-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg">
                           <span className="font-bold text-gray-900 text-sm sm:text-base">
                              Total:
                           </span>
                           <span className="font-bold text-blue-600 text-xl sm:text-2xl">
                              ${calculateTotal()}{" "}
                              {selectedModalityData.currency}
                           </span>
                        </div>
                     </div>

                     {/* Action Button */}
                     <Button
                        variant="none"
                        onClick={handleCompletePayment}
                        disabled={!selectedModality}
                        loading={gettingCheckoutLink}
                        className="bg-gradient-to-r from-blue-600 hover:from-blue-700 disabled:from-gray-400 to-blue-700 hover:to-blue-800 disabled:to-gray-500 shadow-lg hover:shadow-xl px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl !w-full font-bold text-white text-base sm:text-lg disabled:hover:scale-100 transition-all duration-300 disabled:cursor-not-allowed transform"
                     >
                        {gettingCheckoutLink
                           ? "Procesando Pago..."
                           : "Proceder al Pago"}
                     </Button>

                     <p className="mt-2 sm:mt-3 text-gray-500 text-xs text-center">
                        Al continuar, aceptas nuestros términos y condiciones
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
