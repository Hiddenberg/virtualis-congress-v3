import "server-only";
import { getAllCongressRegistrations } from "@/features/congresses/services/congressRegistrationServices";
// import { getOnlineCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
// import { getOnlineCongressProduct } from "@/features/congresses/services/congressProductsServices";
// import {
//    getCongressRegistrationByUserId,
//    registerUserToLatestCongress,
//    updateCongressRegistration,
// } from "@/features/congresses/services/congressRegistrationServices";
import { getCongressById, getLatestCongress } from "@/features/congresses/services/congressServices";
import type { AttendanceModality } from "@/features/congresses/types/congressRegistrationTypes";
// import { sendPaymentConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import {
   checkIfUserHasAccessToRecordings,
   getUserPurchasedModality,
   // createUserPurchaseRecord,
} from "@/features/organizationPayments/services/userPurchaseServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getUserById } from "@/features/users/services/userServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import {
   //  createDBRecord,
   getFullDBRecordsList,
   pbFilter,
   // updateDBRecord,
} from "@/libs/pbServerClientNew";

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
            user,
            hasPaid,
            hasAccessToRecordings,
            attendanceModality: attendanceModality ?? undefined,
         };
      }),
   );

   return details;
}
