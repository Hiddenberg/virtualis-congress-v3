import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { SimpleRecording, SimpleRecordingCampaign } from "../types/recordingsTypes";

export async function createRecordingCampaign(title: string, description: string) {
   const organization = await getOrganizationFromSubdomain();

   const campaignCreated = await createDBRecord<SimpleRecordingCampaign>("SIMPLE_RECORDING_CAMPAIGNS", {
      title,
      description,
      organization: organization.id,
   });

   return campaignCreated;
}

export async function ensuredRecordingCampaign(title: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      title = {:title}
   `,
      {
         organizationId: organization.id,
         title,
      },
   );

   const existingCampaign = await getSingleDBRecord<SimpleRecordingCampaign>("SIMPLE_RECORDING_CAMPAIGNS", filter);
   if (existingCampaign) {
      return existingCampaign;
   }

   const createdCampaign = await createRecordingCampaign(title, "Grabaciones de conferencias para el congreso");
   return createdCampaign;
}

export async function getRecordingsCampaignById(campaignId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:campaignId}
   `,
      {
         organizationId: organization.id,
         campaignId,
      },
   );

   const campaign = await getSingleDBRecord<SimpleRecordingCampaign>("SIMPLE_RECORDING_CAMPAIGNS", filter);

   return campaign;
}

/**
 * Get all recording campaigns for the current organization
 * @returns A list of recording campaigns
 */
export async function getAllSimpleRecordingCampaigns() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );

   const campaigns = await getFullDBRecordsList<SimpleRecordingCampaign>("SIMPLE_RECORDING_CAMPAIGNS", {
      filter,
   });

   return campaigns;
}

/**
 * Get all recordings for a given campaign
 * @param campaignId - The ID of the campaign to get recordings for
 * @returns A list of recordings
 */
export async function getAllCampaignRecordings(campaignId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      campaign = {:campaignId}
   `,
      {
         organizationId: organization.id,
         campaignId,
      },
   );

   const recordings = await getFullDBRecordsList<SimpleRecording>("SIMPLE_RECORDINGS", {
      filter,
   });

   return recordings;
}
