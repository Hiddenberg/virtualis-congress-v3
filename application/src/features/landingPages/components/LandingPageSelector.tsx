import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import ACPLandingPage from "./organizationLandingPages/ACPDiabetesLandingPage";
import CMIMChiapasLandingPage from "./organizationLandingPages/CMIMChiapasLandingPage";
import GeaLandingPage from "./organizationLandingPages/GeaLandingPage";

export default function LandingPageSelector({ organization }: { organization: OrganizationRecord }) {
   const landingPagesMap: Record<string, React.ReactNode> = {
      CMIMCC: <CMIMChiapasLandingPage organization={organization} />,
      "ACP-MX": <ACPLandingPage />,
      HGEA: <GeaLandingPage organization={organization} />,
   };
   const LandingPage = landingPagesMap[organization.shortID];

   if (!LandingPage) {
      return (
         <div>
            <h1>Landing Page not found for {organization.shortID}</h1>
         </div>
      );
   }

   return LandingPage;
}
