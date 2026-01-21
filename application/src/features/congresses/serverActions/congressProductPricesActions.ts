"use server";

import { revalidatePath } from "next/cache";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import {
   createCongressProductPrice,
   getCongressProductPriceById,
   updateCongressProductPriceRecord,
} from "../services/congressProductPricesServices";
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

export async function toggleArchiveProductPriceAction(
   productPriceId: ProductPriceRecord["id"],
): Promise<BackendResponse<ProductPriceRecord>> {
   try {
      const productPrice = await getCongressProductPriceById(productPriceId);
      if (!productPrice) {
         return {
            success: false,
            errorMessage: "Precio del producto no encontrado",
         };
      }

      const stripe = await getOrganizationStripeInstance();

      // Update the stripe price active status
      const updatedStripePrice = await stripe.prices.update(productPrice.stripePriceId, {
         active: productPrice.archived,
      });

      const updatedProductPrice = await updateCongressProductPriceRecord(productPrice.id, {
         archived: !updatedStripePrice.active,
      });

      revalidatePath("/congress-admin/products/[productId]/prices", "page");

      return {
         success: true,
         data: updatedProductPrice,
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
         errorMessage: "Error al archivar el precio del producto",
      };
   }
}
