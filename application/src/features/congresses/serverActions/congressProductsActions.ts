"use server";

import { revalidatePath } from "next/cache";
import { createDefaultCongressProducts } from "../services/congressProductsServices";
import { getLatestCongress } from "../services/congressServices";

export async function createDefaultCongressProductsAction(): Promise<BackendResponse<null>> {
   try {
      const congress = await getLatestCongress();
      await createDefaultCongressProducts(congress.id);

      revalidatePath("/congress-admin/products");
      return {
         success: true,
         data: null,
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
         errorMessage: "Error al crear los productos por defecto",
      };
   }
}
