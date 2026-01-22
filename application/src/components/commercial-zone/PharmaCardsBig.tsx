import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bayerLogo from "@/assets/bayer-logo.png";
import pfizerLogo from "@/assets/pfizer-logo.png";

type CompanyCardProps = {
   name: string;
   logo: StaticImageData;
   description: string;
   backgroundColor: string;
   buttonColor: string;
};

function CompanyCard({ name, logo, description, backgroundColor, buttonColor }: CompanyCardProps) {
   return (
      <div className={`rounded-lg grow p-6 ${backgroundColor} flex items-end`}>
         <div className="flex-1 pr-6">
            <div className="flex justify-center items-center bg-white mb-4 p-6 rounded-lg w-48 h-40">
               <Image src={logo} alt={`${name} logo`} width={80} height={80} />
            </div>
            <div className="ml-4">
               <h2 className="font-bold text-2xl">{name}</h2>
               <Link href="#" className="text-blue-600 text-sm hover:underline">
                  Ver más
               </Link>
               <p className="mb-6 text-sm">{description}</p>
            </div>
         </div>
         <div className="flex flex-col justify-center space-y-2 w-64">
            <button
               type="button"
               className={`w-full py-2 px-4 rounded-lg text-white font-medium ${buttonColor} hover:opacity-90 transition-opacity`}
            >
               Descarga nuestro eBook gratis
            </button>
            <button
               type="button"
               className={`w-full py-2 px-4 rounded-lg text-white font-medium ${buttonColor} hover:opacity-90 transition-opacity`}
            >
               Recibe muestras de producto
            </button>
            <button
               type="button"
               className={`w-full py-2 px-4 rounded-lg text-white font-medium ${buttonColor} hover:opacity-90 transition-opacity`}
            >
               Sorteo de kits de bienestar
            </button>
         </div>
      </div>
   );
}

export default function PharmaCardsBig() {
   return (
      <div className="flex gap-6 mx-auto p-4">
         <CompanyCard
            name="Bayer"
            logo={bayerLogo}
            description="Presentamos nuestras nuevas soluciones farmacéuticas con beneficios exclusivos para los asistentes del congreso."
            backgroundColor="bg-blue-50"
            buttonColor="bg-green-500"
         />
         <CompanyCard
            name="Pfizer"
            logo={pfizerLogo}
            description="Estamos liderando la innovación en nanotecnología médica. Aprovecha nuestras promociones exclusivas durante el congreso."
            backgroundColor="bg-purple-50"
            buttonColor="bg-blue-400"
         />
      </div>
   );
}
