import "server-only";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { getIpInfoFromHeaders } from "@/features/ipInfo/services/ipInfoServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getUserAgentInfoFromHeaders } from "@/features/uaParser/services/uaParserServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import type { NewRegistrationAnalyticsData, RegistrationAnalytics } from "../types/registrationAnalyticsTypes";

export async function createRegistrationAnalyticsRecord(registrationAnalytics: NewRegistrationAnalyticsData) {
   const organization = await getOrganizationFromSubdomain();
   const registrationAnalyticsRecord = await createDBRecord<RegistrationAnalytics>("CONGRESS_REGISTRATION_ANALYTICS", {
      organization: organization.id,
      ...registrationAnalytics,
   });
   return registrationAnalyticsRecord;
}

export async function getRegistrationAnalyticsByCongressAndUserId({
   congressId,
   userId,
}: {
   congressId: CongressRecord["id"];
   userId: UserRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         congressId,
         userId,
      },
   );

   const registrationAnalytics = await getSingleDBRecord<RegistrationAnalytics>("CONGRESS_REGISTRATION_ANALYTICS", filter);

   return registrationAnalytics;
}

export async function getAllRegistrationAnalyticsByCongressId(congressId: CongressRecord["id"]) {
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

   const registrationAnalytics = await getFullDBRecordsList<RegistrationAnalytics>("CONGRESS_REGISTRATION_ANALYTICS", {
      filter,
   });

   return registrationAnalytics;
}

export async function registerUserRegistrationAnalytics({
   congressId,
   userId,
}: {
   congressId: CongressRecord["id"];
   userId: UserRecord["id"];
}) {
   const existingRegistrationAnalytics = await getRegistrationAnalyticsByCongressAndUserId({
      congressId,
      userId,
   });

   if (existingRegistrationAnalytics) {
      return existingRegistrationAnalytics;
   }

   const [ipInfo, userAgentInfo] = await Promise.all([getIpInfoFromHeaders(), getUserAgentInfoFromHeaders()]);

   const newRegistrationAnalyticsRecord = await createRegistrationAnalyticsRecord({
      congress: congressId,
      user: userId,
      ipAddress: ipInfo?.ip,
      city: ipInfo?.city,
      region: ipInfo?.region,
      country: ipInfo?.country,
      timeZone: ipInfo?.timezone,
      browser: userAgentInfo?.browser?.name,
      browserVersion: userAgentInfo?.browser?.version,
      deviceType: userAgentInfo?.device?.type,
      deviceVendor: userAgentInfo?.device?.vendor,
      devicecModel: userAgentInfo?.device?.model,
      os: userAgentInfo?.os?.name,
      osVersion: userAgentInfo?.os?.version,
   });

   return newRegistrationAnalyticsRecord;
}
