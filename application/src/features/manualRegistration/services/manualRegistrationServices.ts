import "server-only";
import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import { getAllCongressRegistrations } from "@/features/congresses/services/congressRegistrationServices";
import { getCongressById, getLatestCongress } from "@/features/congresses/services/congressServices";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";
import type { AttendanceModality, CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import {
   checkIfUserHasAccessToRecordings,
   getUserPurchasedModality,
} from "@/features/organizationPayments/services/userPurchaseServices";
import type { UserPurchaseRecord } from "@/features/organizationPayments/types/userPurchasesTypes";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getUserById } from "@/features/users/services/userServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";

export async function searchUsersRegisteredToCurrentCongress(query: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const registrations = await getFullDBRecordsList<{
      user: UserRecord["id"];
      expand: { user: UserRecord };
   }>("CONGRESS_REGISTRATIONS", {
      filter,
      expand: "user",
   });

   const normalizedQuery = query.trim().toLowerCase();
   const users = registrations
      .map((r) => r.expand.user)
      .filter((u) => {
         if (!normalizedQuery) return true;
         const name = u.name?.toLowerCase() ?? "";
         const email = u.email?.toLowerCase() ?? "";
         return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      });

   // Decorate with payment status; limit to 25 to keep checks reasonable
   const limitedUsers = users.slice(0, 25);
   const results: Array<{
      user: UserRecord;
      hasPaid: boolean;
      hasRecordings: boolean;
   }> = [];
   for (const u of limitedUsers) {
      const hasPaid = await confirmUserCongressPayment(u.id);
      const hasRecordings = await checkIfUserHasAccessToRecordings(u.id, congress.id);
      results.push({
         user: u,
         hasPaid,
         hasRecordings,
      });
   }

   return results;
}

export interface CongressUserRegistrationDetails {
   congressRegistration: CongressRegistrationRecord;
   user: UserRecord;
   hasPaid: boolean;
   hasAccessToRecordings: boolean;
   attendanceModality?: AttendanceModality;
}

export async function getCongressUserRegistrationsDetails(congressId: string): Promise<CongressUserRegistrationDetails[]> {
   const congress = await getCongressById(congressId);
   if (!congress) {
      throw new Error("No se encontró el congreso");
   }

   const congressRegistrations = await getAllCongressRegistrations();

   const details: CongressUserRegistrationDetails[] = await Promise.all(
      congressRegistrations.map(async (registration) => {
         const [user, hasPaid, hasAccessToRecordings, attendanceModality] = await Promise.all([
            getUserById(registration.user),
            confirmUserCongressPayment(registration.user),
            checkIfUserHasAccessToRecordings(registration.user, congressId),
            getUserPurchasedModality(registration.user, congressId),
         ]);

         if (!user) {
            throw new Error("User not found");
         }

         return {
            congressRegistration: registration,
            user,
            hasPaid,
            hasAccessToRecordings,
            attendanceModality: attendanceModality ?? undefined,
         };
      }),
   );

   return details;
}

export async function getCongressUserRegistrationsDetailsOptimized(): Promise<CongressUserRegistrationDetails[]> {
   const [organization, congress] = await Promise.all([getOrganizationFromSubdomain(), getLatestCongress()]);

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const [expandedCongressRegistrations, congressProductsWithPrices] = await Promise.all([
      getFullDBRecordsList<
         CongressRegistrationRecord & {
            expand: {
               user: UserRecord & {
                  expand?: {
                     user__purchases_via_user: UserPurchaseRecord[];
                  };
               };
            };
         }
      >("CONGRESS_REGISTRATIONS", {
         filter,
         expand: "user, user.user__purchases_via_user",
      }),
      getAllCongressProductsWithPrices(congress.id),
   ]);

   const congressRegistrationDetails: CongressUserRegistrationDetails[] = expandedCongressRegistrations.map(
      (expandedRegistration) => {
         const userRecord: UserRecord = {
            id: expandedRegistration.expand.user.id,
            name: expandedRegistration.expand.user.name,
            email: expandedRegistration.expand.user.email,
            collectionId: expandedRegistration.expand.user.collectionId,
            collectionName: expandedRegistration.expand.user.collectionName,
            created: expandedRegistration.expand.user.created,
            updated: expandedRegistration.expand.user.updated,
            organization: expandedRegistration.expand.user.organization,
            role: expandedRegistration.expand.user.role,
            dateOfBirth: expandedRegistration.expand.user.dateOfBirth,
            additionalEmail1: expandedRegistration.expand.user.additionalEmail1,
            additionalEmail2: expandedRegistration.expand.user.additionalEmail2,
            phoneNumber: expandedRegistration.expand.user.phoneNumber,
         };

         const congressRegistrationRecord: CongressRegistrationRecord = {
            id: expandedRegistration.id,
            collectionId: expandedRegistration.collectionId,
            collectionName: expandedRegistration.collectionName,
            created: expandedRegistration.created,
            updated: expandedRegistration.updated,
            organization: expandedRegistration.organization,
            user: expandedRegistration.user,
            congress: expandedRegistration.congress,
            paymentConfirmed: expandedRegistration.paymentConfirmed,
            payment: expandedRegistration.payment,
            registrationType: expandedRegistration.registrationType,
            hasAccessToRecordings: expandedRegistration.hasAccessToRecordings,
            attendanceModality: expandedRegistration.attendanceModality,
         };

         const userPurchaseRecords: UserPurchaseRecord[] =
            expandedRegistration.expand.user.expand?.user__purchases_via_user ?? [];

         const userPurchasedProducts = userPurchaseRecords.reduce((acc, purchase) => {
            const product = congressProductsWithPrices.find((product) => product.product.id === purchase.product);
            if (!product) {
               return acc;
            }

            acc.push(product.product);
            return acc;
         }, [] as CongressProductRecord[]);

         const hasPaid = userPurchasedProducts.some(
            (product) => product.productType === "congress_online_access" || product.productType === "congress_in_person_access",
         );

         const hasAccessToRecordings = userPurchaseRecords.some((purchase) => {
            const purchasedProduct: CongressProductRecord | undefined = congressProductsWithPrices.find(
               (product) => product.product.id === purchase.product,
            )?.product;
            const purchasedPrice: ProductPriceRecord | undefined = congressProductsWithPrices
               .find((product) => product.product.id === purchase.product)
               ?.prices.find((price) => price.id === purchase.price);

            return purchasedProduct?.productType === "congress_recordings" || purchasedPrice?.includesRecordings;
         });

         const attendanceModality = (() => {
            if (userPurchasedProducts.some((product) => product.productType === "congress_in_person_access")) {
               return "in-person";
            } else if (userPurchasedProducts.some((product) => product.productType === "congress_online_access")) {
               return "virtual";
            } else {
               return null;
            }
         })();

         return {
            congressRegistration: congressRegistrationRecord,
            user: userRecord,
            hasPaid,
            hasAccessToRecordings,
            attendanceModality: attendanceModality ?? undefined,
         };
      },
   );

   return congressRegistrationDetails;
}
