import { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

const isDevEnvironment = process.env.NODE_ENV === "development";

export function getRecordingLink(
   recordingId: string,
   organization: OrganizationRecord,
) {
   if (isDevEnvironment) {
      return `http://${organization.subdomain}.localhost:3000/recordings/record/${recordingId}`;
   }

   return `https://${organization.subdomain}.virtualis.app/recordings/record/${recordingId}`;
}
