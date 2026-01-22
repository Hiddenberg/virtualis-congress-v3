import SponsorCarousel from "@/components/conference-zone/SponsorCarousel";
import MainStage from "@/components/partners-demo/conference/regular/MainStage";
import RightPanel from "@/components/partners-demo/conference/regular/RightPanel";
import SessionHeader from "@/components/partners-demo/conference/regular/SessionHeader";
import UpcomingBox from "@/components/partners-demo/conference/regular/UpcomingBox";
import { SanferHeader } from "@/components/partners-demo/lobby/Hero";

export default function SanferConferencePage() {
   return (
      <div className="flex flex-col gap-4 bg-linear-to-br px-6 md:px-10 py-6 pt-0 pb-10">
         <SanferHeader />
         <div className="gap-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
               <MainStage color="red" />
               <SessionHeader />
               <div className="items-start gap-4 grid grid-cols-1 md:grid-cols-2">
                  <SponsorCarousel
                     sponsors={[
                        {
                           name: "FreeStyle Libre",
                           logoURL:
                              "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759194868/774a3db1-46d0-49b2-a31a-1a2d22931e0d.webp",
                           background: "light",
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
