import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";

export default async function GenericPricesSection({ congress }: { congress: CongressRecord }) {
   const productsWithPrices = await getAllCongressProductsWithPrices(congress.id);
   return <div>GenericPricesSection</div>;
}
