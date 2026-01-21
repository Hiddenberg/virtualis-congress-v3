import "server-only";
import { createDBRecord } from "@/libs/pbServerClientNew";
import { ProductPrice } from "../types/congressPricesTypes";

export async function createCongressProductPriceRecord(congressPrice: ProductPrice) {
   const createdCongressPrice = await createDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", congressPrice);

   return createdCongressPrice;
}
