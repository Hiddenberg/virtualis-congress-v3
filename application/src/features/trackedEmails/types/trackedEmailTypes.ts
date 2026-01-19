import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface BaseTrackedEmail {
   organization: OrganizationRecord["id"];
   sentTo: string;
   subject: string;
   status: "sending" | "sent" | "opened" | "errored";
}

export interface SentTrackedEmail extends BaseTrackedEmail {
   status: "sent";
   sentAt: string;
}

export interface OpenedTrackedEmail extends BaseTrackedEmail {
   status: "opened";
   sentAt: string;
   openedAt: string;
}

export interface ErroredTrackedEmail extends BaseTrackedEmail {
   status: "errored";
   errorMessage: string;
}

export type TrackedEmail =
   | SentTrackedEmail
   | OpenedTrackedEmail
   | ErroredTrackedEmail;
export type TrackedEmailRecord = DBRecordItem<TrackedEmail>;
