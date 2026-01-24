import { Building, MonitorIcon } from "lucide-react";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { CongressProductWithPrices } from "@/features/congresses/types/congressProductsTypes";
import FeaturedPriceCard from "./FeaturedPriceCard";
import LocationDisplay from "./LocationDisplay";
import PriceCard from "./PriceCard";

interface InPersonAccessSectionProps {
   congress: CongressRecord;
   product: CongressProductWithPrices;
}

export default function InPersonAccessSection({ congress, product }: InPersonAccessSectionProps) {
   if (product.prices.length === 0) {
      return null;
   }

   return (
      <div className="mb-12">
         <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso Presencial</h3>
         {congress.congressLocation && <LocationDisplay location={congress.congressLocation} />}
         {product.prices.length === 1 ? (
            <FeaturedPriceCard
               priceAmount={product.prices[0].priceAmount}
               currency={product.prices[0].currency}
               icon={Building}
               badge="🏢 PRESENCIAL"
               title="Acceso Completo Presencial"
               description={product.product.description}
               gradientFrom="from-blue-50"
               gradientTo="to-cyan-50"
               borderColor="border-blue-200"
               badgeGradientFrom="from-blue-500"
               badgeGradientTo="to-cyan-500"
               titleBgColor="bg-blue-100"
               titleTextColor="text-blue-700"
               dotColor="bg-blue-400"
               requiresCredentialValidation={product.prices[0].requiresCredentialValidation}
               credentialValidationInstructions={product.prices[0].credentialValidationInstructions}
               footer={
                  <div className="bg-cyan-50 p-3 border border-cyan-200 rounded-lg">
                     <p className="flex items-center gap-2 font-medium text-cyan-800 text-xs">
                        <MonitorIcon className="size-4" />
                        También disponible en línea
                     </p>
                  </div>
               }
            />
         ) : (
            <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
               {product.prices.map((price, index) => (
                  <PriceCard
                     key={price.id}
                     priceName={price.name}
                     priceAmount={price.priceAmount}
                     currency={price.currency}
                     icon={Building}
                     index={index}
                     requiresCredentialValidation={price.requiresCredentialValidation}
                     credentialValidationInstructions={price.credentialValidationInstructions}
                     footer={
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                           <MonitorIcon className="size-3" />
                           <span>También disponible en línea</span>
                        </div>
                     }
                  />
               ))}
            </div>
         )}
      </div>
   );
}
