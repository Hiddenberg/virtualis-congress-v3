import "server-only";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import { NewProductPriceData, ProductPrice, ProductPriceRecord } from "../types/congressProductPricesTypes";
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
      archived: false,
      ...newCongressProductPriceData,
   });

   return newCongressProductPrice;
}

export async function getCongressProductPriceById(productPriceId: ProductPriceRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:productPriceId}
   `,
      {
         organizationId: organization.id,
         productPriceId,
      },
   );
   const productPrice = await getSingleDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", filter);
   return productPrice;
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

export async function updateCongressProductPriceRecord(productPriceId: ProductPriceRecord["id"], newData: Partial<ProductPrice>) {
   const updatedProductPrice = await updateDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", productPriceId, newData);

   return updatedProductPrice;
}
