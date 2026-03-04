import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "@/features/users/types/userTypes";

export interface RegistrationAnalytics {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   user: UserRecord["id"];
   ipAddress?: string;
   city?: string;
   region?: string;
   country?: string;
   timeZone?: string;
   browser?: string;
   browserVersion?: string;
   deviceType?: string;
   deviceVendor?: string;
   devicecModel?: string;
   os?: string;
   osVersion?: string;
}

export type RegistrationAnalyticsRecord = DBRecordItem<RegistrationAnalytics>;
export type NewRegistrationAnalyticsData = Omit<RegistrationAnalytics, "organization">;
