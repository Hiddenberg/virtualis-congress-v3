import GoBackButton from "@/components/global/GoBackButton";
import InPersonLocationCard from "@/components/payment-page/prices/InPersonLocationCard";
import PricePaymentForm from "@/components/payment-page/prices/PricePaymentForm";
import ProductInfoCard from "@/components/payment-page/prices/ProductInfoCard";
import {
   getCongressProductPriceById,
   getRecordingsCongressProductPrices,
} from "@/features/congresses/services/congressProductPricesServices";
import { getCongressProductByPriceId } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function PayPricePage({ params }: { params: Promise<{ priceId: string }> }) {
   const { priceId } = await params;

   const product = await getCongressProductByPriceId(priceId);
   const price = await getCongressProductPriceById(priceId);
   const congress = await getLatestCongress();

   if (!product) {
      throw new Error("Product not found");
   }

   if (!price) {
      throw new Error("Price not found");
   }

   const isInPerson = product.productType === "congress_in_person_access";

   const recordingsPrices = await getRecordingsCongressProductPrices();

   if (recordingsPrices.length === 0) {
      throw new Error("Recordings prices not found");
   }

   const recordingsPrice = recordingsPrices[0];

   return (
      <div className="relative min-h-dvh bg-linear-to-br from-gray-50 via-white to-gray-50">
         {/* Background decoration */}
         <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
         </div>

         <div className="relative z-10 mx-auto p-4 sm:p-6 md:p-8 max-w-6xl min-h-dvh">
            <div className="mb-6">
               <GoBackButton backButtonText="Volver a la lista de precios" />
            </div>

            <div className="mb-6">
               <ProductInfoCard product={product} />
            </div>

            {isInPerson && congress.congressLocation && (
               <div className="mb-6">
                  <InPersonLocationCard location={congress.congressLocation} />
               </div>
            )}

            <PricePaymentForm price={price} recordingsPrice={recordingsPrice} />
         </div>
      </div>
   );
}
