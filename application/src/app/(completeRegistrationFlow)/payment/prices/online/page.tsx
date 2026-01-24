import GoBackButton from "@/components/global/GoBackButton";
import OnlinePricesGrid from "@/components/payment-page/prices/OnlinePricesGrid";
import OnlinePricesHeader from "@/components/payment-page/prices/OnlinePricesHeader";
import { getOnlineCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
import { getOnlineCongressProduct } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function onlinePricesPage() {
   const onlineProduct = await getOnlineCongressProduct();

   if (!onlineProduct) {
      throw new Error("Online product not found");
   }

   const congress = await getLatestCongress();
   const congressModality = congress.modality;
   const onlinePrices = await getOnlineCongressProductPrices();

   if (onlinePrices.length === 0) {
      throw new Error("Online prices not configured");
   }

   return (
      <div className="mx-auto p-4 sm:p-6 md:p-8 max-w-6xl min-h-dvh">
         {congressModality === "hybrid" && (
            <div className="mb-6">
               <GoBackButton backURL="/payment" backButtonText="Volver a la selección de modalidad" />
            </div>
         )}

         <OnlinePricesHeader congressTitle={congress.title} />

         <OnlinePricesGrid prices={onlinePrices} />
      </div>
   );
}
