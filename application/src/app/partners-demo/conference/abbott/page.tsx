import SponsorCarousel from "@/components/conference-zone/SponsorCarousel";
import MainStage from "@/components/partners-demo/conference/regular/MainStage";
import RightPanel from "@/components/partners-demo/conference/regular/RightPanel";
import SessionHeader from "@/components/partners-demo/conference/regular/SessionHeader";
import UpcomingBox from "@/components/partners-demo/conference/regular/UpcomingBox";
import { AbbottHeader } from "@/components/partners-demo/lobby/Hero";
import { PARTNERS_DEMO_CONSTANTS } from "@/data/partnersDemoConstants";

export default function AbbottConferencePage() {
   return (
      <div className="flex flex-col gap-4 bg-linear-to-br from-amber-200 to-amber-300 px-6 md:px-10 py-6 pt-0 pb-10">
         <AbbottHeader />
         <div className="gap-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
               <MainStage color="yellow" />
               <SessionHeader />
               <div className="items-start gap-4 grid grid-cols-1 md:grid-cols-2">
                  <SponsorCarousel
                     sponsors={[
                        {
                           name: "FreeStyle Libre",
                           logoURL: PARTNERS_DEMO_CONSTANTS.FREESTYLE_LOGO_URL,
                           background: "dark",
                        },
                     ]}
                     title="Patrocinadores"
                  />
                  <UpcomingBox />
               </div>
            </div>
            <RightPanel />
         </div>
      </div>
   );
}
