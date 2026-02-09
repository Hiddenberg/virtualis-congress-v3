import GenericCongressLandingPage from "@/features/landingPages/components/organizationLandingPages/GenericCongressLandingPage";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";

export default async function HomePage() {
   const organization = await getOrganizationFromSubdomain();

   return <GenericCongressLandingPage organization={organization} />;
}
