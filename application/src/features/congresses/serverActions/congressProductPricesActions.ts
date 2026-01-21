"use server";

import { revalidatePath } from "next/cache";
import { createCongressProductPrice } from "../services/congressProductPricesServices";
import { NewProductPriceData, ProductPriceRecord } from "../types/congressProductPricesTypes";

export async function createCongressProductPriceAction(
   newCongressProductPricesData: NewProductPriceData,
): Promise<BackendResponse<ProductPriceRecord>> {
   try {
      const newCongressProductPrice = await createCongressProductPrice(newCongressProductPricesData);
      revalidatePath("/congress-admin/products/[productId]/prices", "page");
      return {
         success: true,
         data: newCongressProductPrice,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error al crear el precio del producto",
      };
   }
}
