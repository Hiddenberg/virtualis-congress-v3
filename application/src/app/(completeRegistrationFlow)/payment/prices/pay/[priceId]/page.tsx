import GoBackButton from "@/components/global/GoBackButton";
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
         <h1>PayPricePage</h1>
         <p>{product.name}</p>
         <p>{price.priceAmount}</p>
         <p>{price.currency}</p>
      </div>
   );
}
