import "server-only";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getUserById } from "@/features/users/services/userServices";
import {
   createDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";
import type { SpeakerData } from "@/types/congress";
import type { CongressCertificate } from "../types/certificatesTypes";

export async function createCongressCertificate(
   userId: string,
   displayName: string,
   certificateType: CongressCertificate["certificateType"],
) {
   try {
      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      const randomKey = crypto.randomUUID().replace(/-/g, "").substring(0, 10);
      const newCertificateData: CongressCertificate = {
         organization: organization.id,
         congress: congress.id,
         user: userId,
         status: "pending",
         certificateType: certificateType,
         userDisplayName: displayName,
         emailSent: false,
         certificateKey: randomKey,
      };

      const newCertificate = await createDBRecord<CongressCertificate>(
         "CONGRESS_CERTIFICATES",
         newCertificateData,
      );

      return newCertificate;
   } catch (error) {
      console.error(
         `[createCongressCertificate] Error creating certificate for user ${userId}:`,
         error,
      );
      throw error;
   }
}

export async function getCongressCertificatesForUser(userId: string) {
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

   const certificates = await getFullDBRecordsList<CongressCertificate>(
      "CONGRESS_CERTIFICATES",
      {
         filter,
      },
   );

   return certificates;
}

export async function checkIfUserWasSpeaker(userId: string) {
   try {
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

      const userSpeakerData = await getSingleDBRecord<SpeakerData>(
         "SPEAKERS_DATA",
         filter,
      );
      const wasSpeaker = userSpeakerData !== null;

      return wasSpeaker;
   } catch (error) {
      console.error(
         `[checkIfUserWasSpeaker] Error checking if user ${userId} was a speaker:`,
         error,
      );
      throw error;
   }
}

export async function checkIfUserWasCoordinator(userId: string) {
   try {
      const user = await getUserById(userId);
      if (!user) {
         return false;
      }

      const isCoordinator = user.role === "coordinator";

      return isCoordinator;
   } catch (error) {
      console.error(
         `[checkIfUserWasCoordinator] Error checking if user ${userId} was a coordinator:`,
         error,
      );
      throw error;
   }
}
