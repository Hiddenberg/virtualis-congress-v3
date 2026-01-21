import "server-only";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import { NewProductPriceData, ProductPrice } from "../types/congressProductPricesTypes";
import { CongressProductRecord } from "../types/congressProductsTypes";
import { getCongressProductById } from "./congressProductsServices";
import { getLatestCongress } from "./congressServices";

export async function createCongressProductPriceRecord(congressPrice: ProductPrice) {
   const createdCongressPrice = await createDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", congressPrice);

   return createdCongressPrice;
}

export async function createCongressProductPrice(newCongressProductPriceData: NewProductPriceData) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const congressProduct = await getCongressProductById(newCongressProductPriceData.product);
   if (!congressProduct) {
      throw new Error("Congress product not found");
   }

   const stripe = await getOrganizationStripeInstance();

   const newStripePrice = await stripe.prices.create({
      currency: newCongressProductPriceData.currency,
      unit_amount: newCongressProductPriceData.priceAmount * 100,
      product: congressProduct.stripeProductId,
      nickname: newCongressProductPriceData.name,
   });

   const newCongressProductPrice = await createDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", {
      organization: organization.id,
      congress: congress.id,
      stripePriceId: newStripePrice.id,
      ...newCongressProductPriceData,
   });

   return newCongressProductPrice;
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
