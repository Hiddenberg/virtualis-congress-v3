import type { UserPaymentRecord } from "@/features/organizationPayments/types/organizationStripeCredentialsTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "@/features/users/types/userTypes";
import type { CongressRecord } from "./congressTypes";

export type AttendanceModality = "in-person" | "virtual";
export interface CongressRegistration {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   congress: CongressRecord["id"];
   paymentConfirmed: boolean;
   payment?: UserPaymentRecord["id"];
   registrationType: "regular" | "courtesy";
   attendanceModality?: AttendanceModality;
   hasAccessToRecordings: boolean;
}

export type CongressRegistrationRecord = DBRecordItem<CongressRegistration>;
