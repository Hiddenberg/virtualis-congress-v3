import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import { ProductPrice } from "../types/congressPricesTypes";
import { CongressProductRecord } from "../types/congressProductsTypes";

export async function createCongressProductPriceRecord(congressPrice: ProductPrice) {
   const createdCongressPrice = await createDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", congressPrice);

   return createdCongressPrice;
}

export async function getCongressProductPrices(productId: CongressProductRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      product = {:productId}
   `,
      {
         organizationId: organization.id,
         productId,
      },
   );

   const prices = await getFullDBRecordsList<ProductPrice>("CONGRESS_PRODUCT_PRICES", {
      filter,
      sort: "-created",
   });

   return prices;
}
