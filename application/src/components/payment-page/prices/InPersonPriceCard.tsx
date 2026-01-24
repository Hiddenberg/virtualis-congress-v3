import { ChevronRightIcon, ShieldCheck, UsersIcon } from "lucide-react";
import Link from "next/link";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import { formatPrice, getPriceColorClasses } from "@/features/landingPages/components/organizationLandingPages/GenericCongressLanding/genericPricesSection/utils";

interface InPersonPriceCardProps {
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

export default function InPersonPriceCard({ price, index }: InPersonPriceCardProps) {
   const colors = getPriceColorClasses(index);

   return (
      <Link
         href={`/payment/prices/pay/${price.id}`}
         className="group relative flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
      >
         <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
            <UsersIcon className="w-6 h-6 text-white" />
         </div>
         <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight text-center">{price.name}</h3>
         <div className={`text-center py-2 px-4 rounded-full font-semibold ${colors.text} ${colors.bg} mb-2`}>
            {formatPrice(price.priceAmount, price.currency)}
         </div>
         {price.requiresCredentialValidation && (
            <CredentialValidationBanner credentialValidationInstructions={price.credentialValidationInstructions} />
         )}
         <div className="mt-4 flex justify-center items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
            <span className="font-semibold text-sm">Seleccionar</span>
            <ChevronRightIcon className="w-4 h-4" />
         </div>
      </Link>
   );
}
