import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import abbvieLogo from "@/assets/abbvie-logo.png";
import astraZenecaLogo from "@/assets/astra-logo.png";
import novartisLogo from "@/assets/novartis-logo.png";
import sanofiLogo from "@/assets/sanofi-logo.png";

type CompanyCardProps = {
   name: string;
   logo: StaticImageData;
   backgroundColor: string;
};

function CompanyCard({ name, logo, backgroundColor }: CompanyCardProps) {
   return (
      <div
         className={`rounded-lg p-4 ${backgroundColor} flex flex-col items-center justify-between h-52 grow`}
      >
         <div className="bg-white rounded-lg p-2 mb-2 h-32 w-32 flex items-center justify-center">
            <Image src={logo} alt={`${name} logo`} width={100} height={50} />
         </div>
         <h2 className="text-lg font-bold mb-2">{name}</h2>
         <Link
            href="#"
            className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
         >
            Ver más
         </Link>
      </div>
   );
}

export default function PharmaCardsSmall() {
   return (
      <div className="flex gap-4 w-full mx-auto p-4">
         <CompanyCard
            name="Sanofi"
            logo={sanofiLogo}
            backgroundColor="bg-blue-100"
         />
         <CompanyCard
            name="AstraZeneca"
            logo={astraZenecaLogo}
            backgroundColor="bg-yellow-100"
         />
         <CompanyCard
            name="Novartis"
            logo={novartisLogo}
            backgroundColor="bg-blue-100"
         />
         <CompanyCard
            name="Sanofi"
            logo={abbvieLogo}
            backgroundColor="bg-gray-200"
         />
      </div>
   );
}
