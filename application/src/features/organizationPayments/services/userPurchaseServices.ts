import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";

interface CreateUserPurchaseRecordParams {
   userId: string;
   congressId: string;
   productType: UserPurchase["productType"];
}

export async function createUserPurchaseRecord({ userId, congressId, productType }: CreateUserPurchaseRecordParams) {
   const organization = await getOrganizationFromSubdomain();

   const userPurchase = await createDBRecord<UserPurchase>("USER_PURCHASES", {
      organization: organization.id,
      user: userId,
      congress: congressId,
      productType,
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

export async function getUserPurchasedModality(userId: string, congressId: string) {
   const userPurchases = await getAllUserPurchases({
      userId,
      congressId,
   });

   const inPersonPurchase = userPurchases.find((purchase) => purchase.productType === "in-person_congress");
   const virtualPurchase = userPurchases.find((purchase) => purchase.productType === "virtual_congress");

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
      productType = "recordings_access"
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
