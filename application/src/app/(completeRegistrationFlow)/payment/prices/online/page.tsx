import GoBackButton from "@/components/global/GoBackButton";
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
      <div>
         {congressModality === "hybrid" && (
            <GoBackButton backURL="/payment" backButtonText="Volver a la selección de modalidad" />
         )}

         <h1>Online Prices Page</h1>
      </div>
   );
}
