import { getAllProgramConferencesWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import HeroSection from "./GeaLanding/HeroSection";
import PricingInfo from "./GeaLanding/PricingInfo";

export default async function GeaLandingPage({ organization }: { organization: OrganizationRecord }) {
   const userId = (await getLoggedInUserId()) ?? undefined;
   const congress = await getLatestCongress();
   const conferencesWithSpeakers = await getAllProgramConferencesWithSpeakers();

   return (
      <div className="bg-white min-h-screen">
         <HeroSection userId={userId} organization={organization} congress={congress} conferences={conferencesWithSpeakers} />
         <PricingInfo userId={userId} />
      </div>
   );
}
