type RoleType =
   | "admin"
   | "super_admin"
   | "attendant"
   | "speaker"
   | "coordinator";

interface User {
   organization: OrganizationRecord["id"];
   name: string;
   email: string;
   dateOfBirth?: string;
   phoneNumber?: string;
   role: RoleType;
}
type UserRecord = DBRecordItem<User>;
