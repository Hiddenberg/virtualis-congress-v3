import { PlayCircle } from "lucide-react";
import type { CongressProductWithPrices } from "@/features/congresses/types/congressProductsTypes";
import PriceCard from "./PriceCard";

interface RecordingsSectionProps {
   product: CongressProductWithPrices;
}

export default function RecordingsSection({ product }: RecordingsSectionProps) {
   if (product.prices.length === 0) {
      return null;
   }

   return (
      <div className="mb-12">
         <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso a Grabaciones</h3>
         <div className="gap-6 grid md:grid-cols-2 mx-auto max-w-3xl">
            {product.prices.map((price, index) => (
               <PriceCard
                  key={price.id}
                  priceId={price.id}
                  priceName={price.name}
                  priceAmount={price.priceAmount}
                  currency={price.currency}
                  icon={PlayCircle}
                  index={index + 2}
                  badge="Adicional"
                  description={product.product.description}
                  footer={<p className="text-gray-500 text-xs text-center">Se suma a cualquier modalidad</p>}
               />
            ))}
         </div>
      </div>
   );
}
