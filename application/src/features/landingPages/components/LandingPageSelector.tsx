import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import ACPLandingPage from "./organizationLandingPages/ACPDiabetesLandingPage";
import CMIMChiapasLandingPage from "./organizationLandingPages/CMIMChiapasLandingPage";
import GeaLandingPage from "./organizationLandingPages/GeaLandingPage";
import GenericCongressLandingPage from "./organizationLandingPages/GenericCongressLandingPage";

export default function LandingPageSelector({ organization }: { organization: OrganizationRecord }) {
   const landingPagesMap: Record<string, React.ReactNode> = {
      CMIMCC: <CMIMChiapasLandingPage organization={organization} />,
      "ACP-MX": <ACPLandingPage />,
      HGEA: <GeaLandingPage organization={organization} />,
   };
   const LandingPage = landingPagesMap[organization.shortID];

   if (!LandingPage) {
      return <GenericCongressLandingPage organization={organization} />;
   }

   return LandingPage;
}
