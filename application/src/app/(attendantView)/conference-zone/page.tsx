import SideBarSelector from "@/components/conference-zone/SideBarSelector";

// import SponsorCarousel from "@/components/conference-zone/SponsorCarousel";
// import VideoPlayerSections from "@/components/conference-zone/VideoPlayerSection";

function ConferenceZonePage() {
   return (
      <div className="flex">
         <div className="px-2 w-2/3">
            {/* <VideoPlayerSections conferenceTitle="Test" /> */}
            {/* <SponsorCarousel /> */}
         </div>
         <div className="w-1/3">
            <SideBarSelector />
         </div>
      </div>
   );
}

export default ConferenceZonePage;
