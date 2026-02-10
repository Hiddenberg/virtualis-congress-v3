import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { formatPrice, getCurrencyBadgeColor, getPriceColorClasses } from "./utils";

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

interface PriceCardProps {
   priceName: string;
   priceAmount: number;
   currency: "mxn" | "usd";
   icon: LucideIcon;
   index: number;
   badge?: string;
   description?: string;
   footer?: React.ReactNode;
   requiresCredentialValidation?: boolean;
   credentialValidationInstructions?: string;
}

export default function PriceCard({
   priceName,
   priceAmount,
   currency,
   icon: Icon,
   index,
   badge,
   description,
   footer,
   requiresCredentialValidation,
   credentialValidationInstructions,
}: PriceCardProps) {
   const colors = getPriceColorClasses(index);
   const currencyColors = getCurrencyBadgeColor(currency);

   return (
      <div className="relative flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
         {badge && (
            <div className="-top-3 right-4 absolute bg-linear-to-r from-orange-400 to-red-400 px-3 py-1 rounded-full font-bold text-white text-xs">
               {badge}
            </div>
         )}
         <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
         </div>
         <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{priceName}</h3>
         <div className="flex flex-col items-center gap-2">
            <div className={`text-center py-2 px-4 rounded-full font-semibold ${colors.text} ${colors.bg}`}>
               {formatPrice(priceAmount, currency)}
            </div>
            <span
               className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${currencyColors.bg} ${currencyColors.text} ${currencyColors.ring}`}
            >
               {currency.toUpperCase()}
            </span>
         </div>
         {description && <p className="mt-2 text-gray-500 text-xs text-center">{description}</p>}
         {footer && <div className="mt-3">{footer}</div>}
         {requiresCredentialValidation && (
            <CredentialValidationBanner credentialValidationInstructions={credentialValidationInstructions} />
         )}
      </div>
   );
}
