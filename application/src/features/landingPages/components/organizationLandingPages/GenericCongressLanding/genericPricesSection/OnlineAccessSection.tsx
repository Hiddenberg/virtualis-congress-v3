import { MonitorIcon, Video, Wifi } from "lucide-react";
import type { CongressProductWithPrices } from "@/features/congresses/types/congressProductsTypes";
import FeaturedPriceCard from "./FeaturedPriceCard";
import PriceCard from "./PriceCard";

interface OnlineAccessSectionProps {
   product: CongressProductWithPrices;
}

export default function OnlineAccessSection({ product }: OnlineAccessSectionProps) {
   if (product.prices.length === 0) {
      return null;
   }

   return (
      <div className="mb-12">
         <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso Online</h3>
         {product.prices.length === 1 ? (
            <FeaturedPriceCard
               priceAmount={product.prices[0].priceAmount}
               currency={product.prices[0].currency}
               icon={Video}
               badge="🌐 SOLO EN LÍNEA"
               title="Transmisiones en Vivo"
               description={product.product.description}
               gradientFrom="from-pink-50"
               gradientTo="to-rose-50"
               borderColor="border-pink-200"
               badgeGradientFrom="from-pink-500"
               badgeGradientTo="to-rose-500"
               titleBgColor="bg-pink-100"
               titleTextColor="text-pink-700"
               dotColor="bg-pink-400"
               backgroundDecorationIcon={Wifi}
               backgroundDecorationColor="text-pink-600"
               requiresCredentialValidation={product.prices[0].requiresCredentialValidation}
               credentialValidationInstructions={product.prices[0].credentialValidationInstructions}
            />
         ) : (
            <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
               {product.prices.map((price, index) => (
                  <PriceCard
                     key={price.id}
                     priceName={price.name}
                     priceAmount={price.priceAmount}
                     currency={price.currency}
                     icon={MonitorIcon}
                     index={index}
                     requiresCredentialValidation={price.requiresCredentialValidation}
                     credentialValidationInstructions={price.credentialValidationInstructions}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
