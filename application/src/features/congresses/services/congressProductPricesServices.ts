import "server-only";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import type { NewProductPriceData, ProductPrice, ProductPriceRecord } from "../types/congressProductPricesTypes";
import type { CongressProductRecord } from "../types/congressProductsTypes";
import {
   getCongressProductById,
   getInPersonCongressProduct,
   getOnlineCongressProduct,
   getRecordingsCongressProduct,
} from "./congressProductsServices";
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

export async function getCongressProductPriceByStripePriceId(stripePriceId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      stripePriceId = {:stripePriceId}
   `,
      {
         organizationId: organization.id,
         stripePriceId,
      },
   );

   const productPrice = await getSingleDBRecord<ProductPrice>("CONGRESS_PRODUCT_PRICES", filter);
   return productPrice;
}

export async function getAllCongressProductPrices(productId: CongressProductRecord["id"]) {
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

export async function getInPersonCongressProductPrices() {
   const organization = await getOrganizationFromSubdomain();
   const inPersonProduct = await getInPersonCongressProduct();

   if (!inPersonProduct) {
      throw new Error("In person product not found");
   }

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      product = {:productId} &&
      archived = false
   `,
      {
         organizationId: organization.id,
         productId: inPersonProduct.id,
      },
   );

   const prices = await getFullDBRecordsList<ProductPrice>("CONGRESS_PRODUCT_PRICES", {
      filter,
      sort: "-priceAmount",
   });

   return prices;
}

export async function getOnlineCongressProductPrices() {
   const organization = await getOrganizationFromSubdomain();
   const onlineProduct = await getOnlineCongressProduct();

   if (!onlineProduct) {
      throw new Error("Online product not found");
   }

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      product = {:productId} &&
      archived = false
   `,
      {
         organizationId: organization.id,
         productId: onlineProduct.id,
      },
   );

   const prices = await getFullDBRecordsList<ProductPrice>("CONGRESS_PRODUCT_PRICES", {
      filter,
      sort: "-priceAmount",
   });

   return prices;
}

export async function getRecordingsCongressProductPrices() {
   const organization = await getOrganizationFromSubdomain();
   const recordingsProduct = await getRecordingsCongressProduct();

   if (!recordingsProduct) {
      throw new Error("Recordings product not found");
   }

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      product = {:productId} &&
      archived = false
   `,
      {
         organizationId: organization.id,
         productId: recordingsProduct.id,
      },
   );

   const prices = await getFullDBRecordsList<ProductPrice>("CONGRESS_PRODUCT_PRICES", {
      filter,
      sort: "-priceAmount",
   });

   return prices;
}

export async function getActiveCongressProductPrices(productId: CongressProductRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      product = {:productId} &&
      archived = false
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
