import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { TrackedEmailRecord } from "@/features/trackedEmails/types/trackedEmailTypes";

export interface RecordingTrackedEmail {
   organization: OrganizationRecord["id"];
   recording: SimpleRecordingRecord["id"];
   trackedEmail: TrackedEmailRecord["id"];
   type: "invitation" | "reminder";
}
export type RecordingTrackedEmailRecord = DBRecordItem<RecordingTrackedEmail>;
