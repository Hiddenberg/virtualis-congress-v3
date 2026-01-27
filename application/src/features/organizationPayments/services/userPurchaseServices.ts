import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { UserRecord } from "@/features/users/types/userTypes";
import type { NewUserPurchase, UserPurchase } from "../types/userPurchasesTypes";

export async function createUserPurchaseRecord({ congress, user, price, product }: NewUserPurchase) {
   const organization = await getOrganizationFromSubdomain();

   const userPurchase = await createDBRecord<UserPurchase>("USER_PURCHASES", {
      organization: organization.id,
      user,
      congress,
      price,
      product,
   });

   return userPurchase;
}

export async function getAllUserPurchases({ userId, congressId }: { userId: string; congressId: string }) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      user = {:userId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         userId,
         congressId,
      },
   );

   const userPurchases = await getFullDBRecordsList<UserPurchase>("USER_PURCHASES", {
      filter,
   });

   return userPurchases;
}

export async function getUserPurchaseByProductType({
   userId,
   congressId,
   productType,
}: {
   userId: UserRecord["id"];
   congressId: CongressRecord["id"];
   productType: CongressProductRecord["productType"];
}) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId} &&
      product.productType = {:productType}
      `,
      {
         organizationId: organization.id,
         congressId,
         userId,
         productType,
      },
   );
   const userPurchase = await getSingleDBRecord<UserPurchase>("USER_PURCHASES", filter);

   return userPurchase;
}

export async function getUserPurchasedModality(userId: string, congressId: string) {
   const organization = await getOrganizationFromSubdomain();
   const inPersonPurchaseFilter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId} &&
      product.productType = "congress_in_person_access"
      `,
      {
         organizationId: organization.id,
         congressId,
         userId,
      },
   );
   const inPersonPurchase = await getSingleDBRecord<UserPurchase>("USER_PURCHASES", inPersonPurchaseFilter);

   const virtualPurchaseFilter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId} &&
      product.productType = "congress_online_access"
      `,
      {
         organizationId: organization.id,
         congressId,
         userId,
      },
   );
   const virtualPurchase = await getSingleDBRecord<UserPurchase>("USER_PURCHASES", virtualPurchaseFilter);

   if (inPersonPurchase) {
      return "in-person";
   } else if (virtualPurchase) {
      return "virtual";
   } else {
      return null;
   }
}

export async function checkIfUserHasAccessToRecordings(userId: string, congressId: string) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId} &&
      product.productType = "congress_recordings"
   `,
      {
         organizationId: organization.id,
         congressId,
         userId,
      },
   );
   const recordingsPurchase = await getSingleDBRecord<UserPurchase>("USER_PURCHASES", filter);

   const hasAccessToRecordings = recordingsPurchase !== null;

   return hasAccessToRecordings;
}
