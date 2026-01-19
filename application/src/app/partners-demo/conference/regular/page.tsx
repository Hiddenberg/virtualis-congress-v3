import SponsorCarousel from "@/components/conference-zone/SponsorCarousel";
import MainStage from "@/components/partners-demo/conference/regular/MainStage";
import RightPanel from "@/components/partners-demo/conference/regular/RightPanel";
import SessionHeader from "@/components/partners-demo/conference/regular/SessionHeader";
import UpcomingBox from "@/components/partners-demo/conference/regular/UpcomingBox";
import { ACPHeader } from "@/components/partners-demo/lobby/Hero";

export default function RegularConferencePage() {
   return (
      <div className="flex flex-col gap-4 px-6 md:px-10 py-6 pb-10">
         <ACPHeader eventName="PharmaTech 2025: Innovación y Futuro en la Industria Farmacéutica" />
         <div className="gap-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
               <MainStage color="green" />
               <SessionHeader />
               <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <SponsorCarousel
                     sponsors={[
                        {
                           name: "Virtualis",
                           logoURL:
                              "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741919524/virtualis_congress_logo_qlmh6h.png",
                           background: "light",
                        },
                     ]}
                  />
                  <UpcomingBox />
               </div>
            </div>
            <RightPanel />
         </div>
      </div>
   );
}
