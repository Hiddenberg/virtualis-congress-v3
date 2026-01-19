export interface Organization {
   name: string;
   shortID: string;
   subdomain: string;
   logoURL?: string;
}
export type OrganizationRecord = DBRecordItem<Organization>;
