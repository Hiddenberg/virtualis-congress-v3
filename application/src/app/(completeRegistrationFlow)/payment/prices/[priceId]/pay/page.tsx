import GoBackButton from "@/components/global/GoBackButton";
import PricePaymentForm from "@/components/payment-page/prices/PricePaymentForm";
import { getCongressProductPriceById } from "@/features/congresses/services/congressProductPricesServices";
import { getCongressProductByPriceId } from "@/features/congresses/services/congressProductsServices";

export default async function PayPricePage({ params }: { params: Promise<{ priceId: string }> }) {
   const { priceId } = await params;

   const product = await getCongressProductByPriceId(priceId);
   const price = await getCongressProductPriceById(priceId);

   if (!product) {
      throw new Error("Product not found");
   }

   if (!price) {
      throw new Error("Price not found");
   }

   return (
      <div>
         <GoBackButton backButtonText="Volver a la lista de precios" />
         {/* Show product and price details */}

         {/* If the product is in person, show the congress location */}
         <PricePaymentForm price={price} />
      </div>
   );
}
