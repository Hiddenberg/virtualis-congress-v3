import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface CongressCertificate {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   user: UserRecord["id"];
   status: "pending" | "sent" | "rejected";
   certificateType: "attendee" | "speaker" | "coordinator";
   userDisplayName: string;
   emailSent: boolean;
   lastEmailSentAt?: string;
   certificateKey: string;
}
export type CongressCertificateRecord = DBRecordItem<CongressCertificate>;

export interface CertificateDesign {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   backgroundURL: string;
   nameXPosition: number;
   nameYPosition: number;
   nameColor: string;
   nameFontSizeMultiplier: number;
   certificateType: CongressCertificate["certificateType"];
}
export type CertificateDesignRecord = DBRecordItem<CertificateDesign>;
