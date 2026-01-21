import { getAllProgramConferencesWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import ACPHeroSection from "./ACPDiabetesLanding/ACPHeroSection";
import ACPPricingInfo from "./ACPDiabetesLanding/ACPPricingInfo";

export default async function ACPLandingPage() {
   const userId = (await getLoggedInUserId()) ?? undefined;
   const congress = await getLatestCongress();
   const conferencesWithSpeakers = await getAllProgramConferencesWithSpeakers();
   const organization = await getOrganizationFromSubdomain();

   return (
      <div className="bg-white min-h-screen">
         <ACPHeroSection userId={userId} organization={organization} congress={congress} conferences={conferencesWithSpeakers} />
         <ACPPricingInfo userId={userId} />
      </div>
   );
}
