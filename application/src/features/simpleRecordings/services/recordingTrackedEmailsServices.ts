import type { TrackedEmailRecord } from "@/features/trackedEmails/types/trackedEmailTypes";
import { createDBRecord, getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type { RecordingTrackedEmail } from "../types/recordingTrackedEmailTypes";

export async function createRecordingTrackedEmailRecord({
   recordingId,
   trackedEmailId,
   type,
}: {
   recordingId: SimpleRecordingRecord["id"];
   trackedEmailId: TrackedEmailRecord["id"];
   type: "invitation" | "reminder";
}) {
   const organization = await getOrganizationFromSubdomain();

   const recordingTrackedEmail = await createDBRecord<RecordingTrackedEmail>("SIMPLE_RECORDING_TRACKED_EMAILS", {
      organization: organization.id,
      recording: recordingId,
      trackedEmail: trackedEmailId,
      type,
   });

   return recordingTrackedEmail;
}

export type RecordingTrackedEmailWithType = TrackedEmailRecord & {
   type: RecordingTrackedEmail["type"];
};

export async function getRecordingTrackedEmails(
   recordingId: SimpleRecordingRecord["id"],
): Promise<RecordingTrackedEmailWithType[]> {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      recording = {:recordingId}
   `,
      {
         organizationId: organization.id,
         recordingId,
      },
   );

   const recordingTrackedEmails = await getFullDBRecordsList<
      RecordingTrackedEmail & {
         expand: {
            trackedEmail: TrackedEmailRecord;
         };
      }
   >("SIMPLE_RECORDING_TRACKED_EMAILS", {
      filter,
      expand: "trackedEmail",
      sort: "-created",
   });

   return recordingTrackedEmails.map((recordingTrackedEmail) => {
      return {
         ...recordingTrackedEmail.expand.trackedEmail,
         type: recordingTrackedEmail.type,
      };
   });
}
