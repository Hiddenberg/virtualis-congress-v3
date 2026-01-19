import {
   CMIM_CONFERENCES_DAY_1,
   CMIM_CONFERENCES_DAY_2,
} from "@/data/tempConstants";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import FooterSection from "./CMIMChiapasLanding/FooterSection";
import HeroSection from "./CMIMChiapasLanding/HeroSection";
import ProgramSchedule from "./CMIMChiapasLanding/ProgramSchedule";
import RegistrationInfo from "./CMIMChiapasLanding/RegistrationInfo";

export default async function CMIMChiapasLandingPage({
   organization,
}: {
   organization: OrganizationRecord;
}) {
   const organizationLogoUrl = organization.logoURL ?? "";
   const conferencesDay1 = CMIM_CONFERENCES_DAY_1;
   const conferencesDay2 = CMIM_CONFERENCES_DAY_2;
   const userId = (await getLoggedInUserId()) ?? undefined;

   // const flyerImageUrl = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1753754364/flyer_qvhh0l.webp"
   const videoUrl = "/CMIMCC/videos/video-presentacion.webm";

   return (
      <div className="min-h-screen">
         {/* Hero Section */}
         <HeroSection
            // flyerImageUrl={flyerImageUrl}
            videoURL={videoUrl}
            userId={userId}
            organizationLogoUrl={organizationLogoUrl}
         />

         {/* Registration Information Section */}
         <RegistrationInfo userId={userId} />

         {/* Program Schedule Section */}
         <ProgramSchedule
            conferencesDay1={conferencesDay1}
            conferencesDay2={conferencesDay2}
            userId={userId}
         />

         {/* Footer */}
         <FooterSection />
      </div>
   );
}
