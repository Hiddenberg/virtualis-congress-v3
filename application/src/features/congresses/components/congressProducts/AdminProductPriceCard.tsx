import { CheckCircleIcon, HashIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import { ProductPriceRecord } from "../../types/congressPricesTypes";

function formatPrice(amount: number, currency: "mxn" | "usd"): string {
   return new Intl.NumberFormat(currency === "mxn" ? "es-MX" : "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount);
}

function getCurrencyBadgeColor(currency: "mxn" | "usd") {
   return currency === "mxn"
      ? { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-600/20" }
      : { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-600/20" };
}

export default function AdminProductPriceCard({ price }: { price: ProductPriceRecord }) {
   const currencyColors = getCurrencyBadgeColor(price.currency);
   const formattedPrice = formatPrice(price.priceAmount, price.currency);

   return (
      <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl h-full transition-all duration-200">
         <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-snug mb-2">{price.name}</h3>
            </div>
         </div>

         <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-3">
               <span className="font-bold text-gray-900 text-2xl">{formattedPrice}</span>
               <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${currencyColors.bg} ${currencyColors.text} ${currencyColors.ring}`}
               >
                  {price.currency.toUpperCase()}
               </span>
            </div>
         </div>

         <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2">
               {price.requiresCredentialValidation ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                     <ShieldCheckIcon className="w-3 h-3" />
                     Requiere validación
                  </div>
               ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20">
                     <CheckCircleIcon className="w-3 h-3" />
                     Sin validación
                  </div>
               )}
            </div>

            {price.requiresCredentialValidation && price.credentialValidationInstructions && (
               <div className="flex items-start gap-2 bg-amber-50 px-3 py-2 border border-amber-200 rounded-lg">
                  <InfoIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm leading-relaxed">{price.credentialValidationInstructions}</p>
               </div>
            )}
         </div>

         <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-500">
               <HashIcon className="w-3.5 h-3.5" />
               <span className="font-mono text-xs truncate" title={price.stripePriceId}>
                  {price.stripePriceId}
               </span>
            </div>
         </div>
      </div>
   );
}
