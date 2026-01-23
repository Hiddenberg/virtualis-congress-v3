import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { CongressRecord } from "./congressTypes";

export interface CongressLandingConfiguration {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   colorScheme: "green" | "blue" | "purple";
   additionalLogosURLs?: string[];
}

export type CongressLandingConfigurationRecord = DBRecordItem<CongressLandingConfiguration>;
export type NewCongressLandingConfigurationData = Omit<CongressLandingConfiguration, "organization">;
