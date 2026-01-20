import {
   createDBRecord,
   getFullDBRecordsList,
   pbFilter,
} from "@/libs/pbServerClientNew";
import "server-only";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   CongressPrice,
   CongressPriceRecord,
} from "../types/congressPricesTypes";
import { CongressRecord, NewCongressPriceData } from "../types/congressTypes";
import { getLatestCongress } from "./congressServices";

export async function createCongressPriceRecord(congressPrice: CongressPrice) {
   const createdCongressPrice = await createDBRecord<CongressPrice>(
      "CONGRESS_PRICES",
      congressPrice,
   );

   return createdCongressPrice;
}

export async function getAllCongressPrices(congressId: CongressRecord["id"]) {
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
   const congressPrices = await getFullDBRecordsList<CongressPrice>(
      "CONGRESS_PRICES",
      {
         filter: filter,
      },
   );

   return congressPrices;
}
