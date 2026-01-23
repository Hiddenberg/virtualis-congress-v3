import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import type {
   CongressLandingConfiguration,
   NewCongressLandingConfigurationData,
} from "../types/congressLandingConfigurationsTypes";
import type { CongressRecord } from "../types/congressTypes";

export async function createCongressLandingConfigurationRecord(newCongressLandingConfig: NewCongressLandingConfigurationData) {
   const organization = await getOrganizationFromSubdomain();

   const newCongressLandingConfigRecord = await createDBRecord<CongressLandingConfiguration>("CONGRESS_LANDING_CONFIGURATIONS", {
      organization: organization.id,
      ...newCongressLandingConfig,
   });

   return newCongressLandingConfigRecord;
}

export async function getCongressLandingConfigurationByCongressId(congressId: CongressRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId,
      },
   );

   const congressLandingConfiguration = await getSingleDBRecord<CongressLandingConfiguration>(
      "CONGRESS_LANDING_CONFIGURATIONS",
      filter,
   );

   return congressLandingConfiguration;
}
