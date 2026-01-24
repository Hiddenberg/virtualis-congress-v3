import { getAllProgramConferencesWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import { getCongressLandingConfigurationByCongressId } from "@/features/congresses/services/congressLandingConfigurationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import GenericHeroSection from "./GenericCongressLanding/GenericHeroSection";
import GenericPricesSection from "./GenericCongressLanding/GenericPricesSection";

export default async function GenericCongressLandingPage({ organization }: { organization: OrganizationRecord }) {
   const userId = (await getLoggedInUserId()) ?? undefined;
   const congress = await getLatestCongress();
   const [conferencesWithSpeakers, congressLandingConfiguration] = await Promise.all([
      getAllProgramConferencesWithSpeakers(),
      getCongressLandingConfigurationByCongressId(congress.id),
   ]);

   if (!congressLandingConfiguration) {
      throw new Error("Congress landing configuration not found");
   }

   return (
      <div>
         <GenericHeroSection
            landingConfiguration={congressLandingConfiguration}
            conferences={conferencesWithSpeakers}
            congress={congress}
            organization={organization}
            userId={userId}
         />
         <GenericPricesSection congress={congress} userId={userId} />
      </div>
   );
}
