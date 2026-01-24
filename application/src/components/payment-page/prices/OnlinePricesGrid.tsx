import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import OnlinePriceCard from "./OnlinePriceCard";

interface OnlinePricesGridProps {
   prices: ProductPriceRecord[];
}

export default function OnlinePricesGrid({ prices }: OnlinePricesGridProps) {
   if (prices.length === 0) {
      return (
         <div className="flex flex-col justify-center items-center bg-gray-50 py-12 border border-gray-200 border-dashed rounded-xl">
            <p className="text-gray-500 text-lg">No hay precios disponibles en este momento</p>
         </div>
      );
   }

   return (
      <div className="flex flex-wrap *:flex-1 justify-center gap-6 *:min-w-90 lg:*:max-w-1/3">
         {prices.map((price, index) => (
            <OnlinePriceCard key={price.id} price={price} index={index} />
         ))}
      </div>
   );
}
