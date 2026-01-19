import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import {
   createDBRecord,
   getDBRecordById,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import type {
   BaseTrackedEmail,
   TrackedEmail,
} from "../types/trackedEmailTypes";

type NewTrackedEmailData = {
   sentTo: string;
   subject: string;
};
export async function createTrackedEmailRecord({
   sentTo,
   subject,
}: NewTrackedEmailData) {
   const organization = await getOrganizationFromSubdomain();

   const trackedEmailRecord = await createDBRecord<BaseTrackedEmail>(
      "TRACKED_EMAILS",
      {
         organization: organization.id,
         sentTo,
         subject,
         status: "sending",
      },
   );

   return trackedEmailRecord;
}

export async function getTrackedEmailById(trackedEmailId: string) {
   const trackedEmailRecord = await getDBRecordById<TrackedEmail>(
      "TRACKED_EMAILS",
      trackedEmailId,
   );

   return trackedEmailRecord;
}

export async function updateTrackedEmailRecord({
   trackedEmailId,
   updatedData,
}: {
   trackedEmailId: string;
   updatedData: Partial<TrackedEmail>;
}) {
   const trackedEmailRecord = await updateDBRecord<TrackedEmail>(
      "TRACKED_EMAILS",
      trackedEmailId,
      updatedData,
   );

   return trackedEmailRecord;
}
