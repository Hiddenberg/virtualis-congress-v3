// Aditional data
interface AdditionalData {
   [key: string]: unknown;
}

interface AttendantData {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   additionalData: AdditionalData;
}
type AttendantDataRecord = DBRecordItem<"ATTENDANTS_DATA">;
