import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import type { CongressRegistration } from "../types/congressRegistrationTypes";
import { getLatestCongress } from "./congressServices";

export async function getAllCongressRegistrations() {
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

   const congressRegistrations = await getFullDBRecordsList<CongressRegistration>("CONGRESS_REGISTRATIONS", {
      filter,
   });

   return congressRegistrations;
}

export async function getAllOrganizationUsersRegisteredToCongress() {
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

   const congressRegistrations = await getFullDBRecordsList<
      CongressRegistration & {
         expand: {
            user: UserRecord;
         };
      }
   >("CONGRESS_REGISTRATIONS", {
      filter,
      expand: "user",
   });

   return congressRegistrations.map((registration) => registration.expand.user);
}

export async function getAllCongressRegistrationsWithUsers() {
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

   const congressRegistrations = await getFullDBRecordsList<
      CongressRegistration & {
         expand: {
            user: UserRecord;
         };
      }
   >("CONGRESS_REGISTRATIONS", {
      filter,
      expand: "user",
   });

   return congressRegistrations;
}

export async function getCongressRegistrationByUserId(userId: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
         userId,
      },
   );

   const congressRegistration = await getSingleDBRecord<CongressRegistration>("CONGRESS_REGISTRATIONS", filter);

   return congressRegistration;
}

export async function registerUserToLatestCongress(userId: string) {
   const latestCongress = await getLatestCongress();

   if (!latestCongress) {
      throw new Error("No congress found");
   }

   const congressRegistration = await createDBRecord<CongressRegistration>("CONGRESS_REGISTRATIONS", {
      congress: latestCongress.id,
      organization: latestCongress.organization,
      user: userId,
      paymentConfirmed: false,
      registrationType: "regular",
      hasAccessToRecordings: false,
   });

   return congressRegistration;
}

export async function updateCongressRegistration(congressRegistrationId: string, data: Partial<CongressRegistration>) {
   const updatedCongressRegistration = await updateDBRecord<CongressRegistration>(
      "CONGRESS_REGISTRATIONS",
      congressRegistrationId,
      data,
   );

   return updatedCongressRegistration;
}
