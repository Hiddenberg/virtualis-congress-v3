import SponsorCarousel, {
   type CarouselSponsor,
} from "@/components/conference-zone/SponsorCarousel";
import ConferenceGrid from "@/components/partners-demo/lobby/ConferenceGrid";
import Hero from "@/components/partners-demo/lobby/Hero";

const lobbySponsors: CarouselSponsor[] = [
   {
      name: "Virtualis",
      logoURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741919524/virtualis_congress_logo_qlmh6h.png",
      background: "light",
   },
   {
      name: "Sanfer",
      logoURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759192946/897825fa-020d-44d2-9f08-17094034675a.webp",
      background: "light",
   },
   {
      name: "Abbott",
      logoURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759192890/c26b40ec-40ea-4357-b885-0235e84fd20c.webp",
      background: "dark",
   },
   {
      name: "ACP Mexico Chapter",
      logoURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png",
      background: "light",
   },
];

export default function PartnersDemoLobbyPage() {
   const conferences = [
      {
         id: "1",
         time: "08:00",
         duration: "09:00",
         title: "El paciente hipertenso hospitalizado, ¿debo tratarlos a todos?",
         speaker: "Dra. Liz Martínez Navarro",
         link: "/partners-demo/conference/regular",
      },
      {
         id: "2",
         time: "09:00",
         duration: "09:35",
         title: "Hora comercial Abbott",
         speaker: "Dr. Benjamín Sandoval Pérez",
         link: "/partners-demo/conference/abbott",
      },
      {
         id: "3",
         time: "09:35",
         duration: "10:10",
         title: "Hora comercial Sanfer",
         speaker: "Dr. Luis Vásquez García",
         link: "/partners-demo/conference/sanfer",
      },
      {
         id: "4",
         time: "10:10",
         duration: "10:40",
         title: "Casos clínicos de alergia para el internista",
         speaker: "Dr. Carlos Lenin Pliego",
      },
   ];

   return (
      <div className="flex flex-col gap-4 pb-6">
         <Hero
            eventName="Masterclass en diabetes"
            congressTitle="Masterclass en diabetes"
            congressSubtitle="Noviembre 2025"
         />
         <div className="px-6 md:px-10">
            <SponsorCarousel sponsors={lobbySponsors} />
         </div>
         {/* <DaySwitcher days={["Jueves 24", "Viernes 25", "Sábado 26"]} /> */}
         <ConferenceGrid items={conferences} />
         <div className="px-6 md:px-10">
            <div className="flex items-center gap-3 mt-2">
               <div className="bg-blue-600 rounded-full w-2 h-2" />
               <div className="bg-gray-300 rounded-full w-2 h-2" />
               <div className="bg-gray-300 rounded-full w-2 h-2" />
            </div>
         </div>
         {/* <BottomCTA /> */}
      </div>
   );
}
