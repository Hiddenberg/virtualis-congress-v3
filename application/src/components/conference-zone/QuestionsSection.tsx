import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import DynamedexLogo from "@/assets/sponsorLogos/Dynamedex.jpg";
import VirtualisLogo from "@/assets/sponsorLogos/VirtualisLogo.png";

type Sponsor = {
   name: string;
   logo: StaticImageData;
   url: string;
};

const sponsors: Sponsor[] = [
   {
      name: "Virtualis",
      logo: VirtualisLogo,
      url: "https://virtualis.app",
   },
   {
      name: "DynamedexLogo",
      logo: DynamedexLogo,
      url: "https://www.dynamedex.com/",
   },
];

export function DiamondSponsorSubSection() {
   return (
      <div className="bg-gray-100 mx-auto p-6 rounded-xl w-full">
         <h2 className="mb-6 font-bold text-xl text-center">
            Patrocinadores Diamante
         </h2>
         <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {sponsors.map((sponsor) => (
               <Link
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  className="flex justify-center items-center bg-white shadow-md p-4 rounded-lg"
               >
                  <Image
                     src={sponsor.logo}
                     alt={`${sponsor.name} logo`}
                     width={120}
                     height={60}
                     className="max-w-full max-h-full object-contain"
                  />
               </Link>
            ))}
         </div>
      </div>
   );
}
