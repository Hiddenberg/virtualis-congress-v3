import { ChevronRightIcon, MonitorIcon, PlayIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import {
   formatPrice,
   getCurrencyBadgeColor,
   getPriceColorClasses,
} from "@/features/landingPages/components/organizationLandingPages/GenericCongressLanding/genericPricesSection/utils";

interface OnlinePriceCardProps {
   price: ProductPriceRecord;
   index: number;
}

function CredentialValidationBanner({ credentialValidationInstructions }: { credentialValidationInstructions?: string }) {
   return (
      <div className="bg-amber-50 mt-3 p-2 border border-amber-200 rounded-lg w-full">
         <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-800 text-xs">Requiere validación de credenciales</span>
         </div>
         {credentialValidationInstructions && (
            <p className="mt-1 text-amber-700 text-xs text-center">{credentialValidationInstructions}</p>
         )}
      </div>
   );
}

export default function OnlinePriceCard({ price, index }: OnlinePriceCardProps) {
   const colors = getPriceColorClasses(index);
   const currencyColors = getCurrencyBadgeColor(price.currency);

   return (
      <Link
         href={`/payment/prices/${price.id}/pay`}
         className="group relative flex flex-col items-center bg-white hover:shadow-xl p-6 border-2 border-gray-100 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      >
         <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
            <MonitorIcon className="w-6 h-6 text-white" />
         </div>
         <h3 className="mb-2 font-bold text-gray-900 text-sm text-center leading-tight">{price.name}</h3>
         {price.includesRecordings && (
            <div className="mb-2 inline-flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md ring-1 ring-purple-600/20 ring-inset font-medium text-purple-700 text-xs">
               <PlayIcon className="w-3 h-3" />
               Incluye grabaciones
            </div>
         )}
         <div className="flex flex-col items-center gap-2 mb-2">
            <div className={`text-center py-2.5 px-5 rounded-full font-bold ${colors.text} ${colors.bg} shadow-sm`}>
               {formatPrice(price.priceAmount, price.currency)}
            </div>
            <span
               className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${currencyColors.bg} ${currencyColors.text} ${currencyColors.ring}`}
            >
               {price.currency.toUpperCase()}
            </span>
         </div>
         {price.requiresCredentialValidation && (
            <CredentialValidationBanner credentialValidationInstructions={price.credentialValidationInstructions} />
         )}
         <div className="flex justify-center items-center gap-2 mt-4 text-gray-600 group-hover:text-gray-900 transition-colors">
            <span className="font-semibold text-sm">Seleccionar</span>
            <ChevronRightIcon className="w-4 h-4" />
         </div>
      </Link>
   );
}
