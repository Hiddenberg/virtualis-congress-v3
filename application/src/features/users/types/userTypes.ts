import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export type RoleType = "admin" | "super_admin" | "attendant" | "speaker" | "coordinator";

export interface User {
   organization: OrganizationRecord["id"];
   name: string;
   email: string;
   dateOfBirth?: string;
   phoneNumber?: string;
   role: RoleType;
}
export type UserRecord = DBRecordItem<User>;
