import { getOrganizationFromSubdomain } from "../services/organizationServices";

export default async function OrganizationSpecificComponent({
   organizationShortID,
   children,
}: {
   organizationShortID: string;
   children: React.ReactNode;
}) {
   const organization = await getOrganizationFromSubdomain();

   if (organization.shortID !== organizationShortID) {
      return null;
   }

   return children;
}
