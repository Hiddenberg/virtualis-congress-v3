import "server-only";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import { CongressProduct, CongressProductRecord, NewCongressProductData } from "../types/congressProductsTypes";
import { CongressRecord } from "../types/congressTypes";
import { getCongressById } from "./congressServices";

export async function createCongressProductRecord(newCongressProduct: CongressProduct) {
   const createdCongressProduct = await createDBRecord<CongressProduct>("CONGRESS_PRODUCTS", newCongressProduct);

   return createdCongressProduct;
}

export async function createCongressProduct(newCongressProductData: NewCongressProductData) {
   const organization = await getOrganizationFromSubdomain();

   // Create the product in Stripe
   const stripe = await getOrganizationStripeInstance();
   const stripeProdduct = await stripe.products.create({
      name: newCongressProductData.name,
      description: newCongressProductData.description,
   });

   const newCongressProduct = await createDBRecord<CongressProduct>("CONGRESS_PRODUCTS", {
      organization: organization.id,
      stripeProductId: stripeProdduct.id,
      ...newCongressProductData,
   });

   return newCongressProduct;
}

export async function createDefaultCongressProducts(congressId: CongressRecord["id"]) {
   const congress = await getCongressById(congressId);
   if (!congress) {
      throw new Error("Congress not found");
   }

   const organization = await getOrganizationFromSubdomain();

   const defaultCongressProducts: NewCongressProductData[] = [
      {
         name: `${congress.title} - Acceso Online`,
         description: "Acceso en linea a los contenidos del congreso",
         congress: congress.id,
         productType: "congress_online_access",
      },
      {
         name: `${congress.title} - Acceso a Grabaciones`,
         description: "Acceso a las grabaciones del congreso una vez finalizado el evento",
         congress: congress.id,
         productType: "congress_recordings",
      },
   ];

   // If the congress is hybrid, add the in-person access product
   if (congress.modality === "hybrid") {
      defaultCongressProducts.push({
         name: `${congress.title} - Acceso Presencial`,
         description: "Acceso presencial al congreso",
         congress: congress.id,
         productType: "congress_in_person_access",
      });
   }

   const createdProducts = [];

   for (const defaultCongressProduct of defaultCongressProducts) {
      // Check if the product already exists
      const existingProductFilter = pbFilter(
         `
         organization = {:organizationId} &&
         congress = {:congressId} &&
         productType = {:productType}
         `,
         {
            organizationId: organization.id,
            congressId: congress.id,
            productType: defaultCongressProduct.productType,
         },
      );

      const existingProduct = await getSingleDBRecord<CongressProduct>("CONGRESS_PRODUCTS", existingProductFilter);

      // If the product already exists, skip it
      if (existingProduct) {
         console.log(`[createDefaultCongressProducts] Product already exists, skipping: ${defaultCongressProduct.name}`);
         continue;
      }

      // If the product doesn't exist, create it
      const createdProduct = await createCongressProduct(defaultCongressProduct);
      createdProducts.push(createdProduct);
      console.log(`[createDefaultCongressProducts] Created product: ${defaultCongressProduct.name}`);
   }

   return createdProducts;
}

export async function getAllCongressProducts(congressId: CongressRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId,
      },
   );

   const congressProducts = await getFullDBRecordsList<CongressProduct>("CONGRESS_PRODUCTS", {
      filter,
   });

   return congressProducts;
}

export async function getCongressProductById(productId: CongressProductRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:productId}
   `,
      {
         organizationId: organization.id,
         productId,
      },
   );

   const product = await getSingleDBRecord<CongressProduct>("CONGRESS_PRODUCTS", filter);

   return product;
}
