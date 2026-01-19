import LandingPageSelector from "@/features/landingPages/components/LandingPageSelector";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";

export default async function HomePage() {
   const organization = await getOrganizationFromSubdomain();

   return <LandingPageSelector organization={organization} />;
}
