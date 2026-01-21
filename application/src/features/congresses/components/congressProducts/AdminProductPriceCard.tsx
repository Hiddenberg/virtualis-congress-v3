import { CheckCircleIcon, HashIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import type { ProductPriceRecord } from "../../types/congressProductPricesTypes";
import ToggleArchiveProductPriceButton from "./ToggleArchiveProductPriceButton";

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

function ProductStatusBadge({ archived }: { archived: boolean }) {
   const statusText = archived ? "Archivado" : "Activo";
   const statusColor = archived ? "bg-gray-100 text-gray-700" : "bg-green-50 text-green-700";
   return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium ring-1 ring-inset ${statusColor}`}>
         {statusText}
      </span>
   );
}

export default function AdminProductPriceCard({ price }: { price: ProductPriceRecord }) {
   const currencyColors = getCurrencyBadgeColor(price.currency);
   const formattedPrice = formatPrice(price.priceAmount, price.currency);

   return (
      <div
         className={`flex flex-col shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl h-full transition-all duration-200 ${price.archived ? "bg-gray-50" : "bg-white"}`}
      >
         <div className="flex justify-between items-start gap-4 mb-4">
            <div className="space-y-1">
               <ProductStatusBadge archived={price.archived} />
               <h3 className="mb-2 font-semibold text-gray-900 text-lg line-clamp-2 leading-snug" title={price.name}>
                  {price.name}
               </h3>
            </div>
            <ToggleArchiveProductPriceButton productPrice={price} />
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
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md ring-1 ring-amber-600/20 ring-inset font-medium text-amber-700 text-xs">
                     <ShieldCheckIcon className="w-3 h-3" />
                     Requiere validación
                  </div>
               ) : (
                  <div className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md ring-1 ring-gray-600/20 ring-inset font-medium text-gray-700 text-xs">
                     <CheckCircleIcon className="w-3 h-3" />
                     Sin validación
                  </div>
               )}
            </div>

            {price.requiresCredentialValidation && price.credentialValidationInstructions && (
               <div className="flex items-start gap-2 bg-amber-50 px-3 py-2 border border-amber-200 rounded-lg">
                  <InfoIcon className="mt-0.5 w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-amber-800 text-sm leading-relaxed">{price.credentialValidationInstructions}</p>
               </div>
            )}
         </div>

         <div className="mt-auto pt-4 border-gray-200 border-t">
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
