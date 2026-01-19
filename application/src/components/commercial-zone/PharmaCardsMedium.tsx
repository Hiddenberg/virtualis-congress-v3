import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import jandjLogo from "@/assets/jandj-logo.png";
import merckLogo from "@/assets/merck-logo.png";
import rocheLogo from "@/assets/roche-logo.png";

type CompanyCardProps = {
   name: string;
   logo: StaticImageData;
   backgroundColor: string;
   buttonColor: string;
   textColor: string;
   actions: string[];
};

function CompanyCard({
   name,
   logo,
   backgroundColor,
   buttonColor,
   actions,
   textColor,
}: CompanyCardProps) {
   return (
      <div
         className={`rounded-lg p-6 ${backgroundColor} flex flex-col items-center grow`}
      >
         <div className="bg-white rounded-lg p-4 mb-4">
            <Image src={logo} alt={`${name} logo`} width={120} height={60} />
         </div>
         <h2
            className={`text-2xl font-bold mb-1 ${buttonColor.replace("bg-", "text-")}`}
         >
            {name}
         </h2>
         <Link href="#" className="text-sm text-blue-600 hover:underline mb-6">
            Ver más
         </Link>
         {actions.map((action, index) => (
            <button
               key={index}
               className={`w-full py-2 px-4 rounded-lg text-${buttonColor.includes("white") ? "gray-800" : "white"} font-medium ${buttonColor} ${textColor} hover:opacity-90 transition-opacity mb-2`}
            >
               {action}
            </button>
         ))}
      </div>
   );
}

export default function PharmaCardsMedium() {
   return (
      <div className="flex gap-6 w-full mx-auto p-4">
         <CompanyCard
            name="Johnson & Johnson"
            logo={jandjLogo}
            backgroundColor="bg-red-50"
            buttonColor="bg-red-200"
            textColor="text-red-800"
            actions={[
               "Prueba gratuita de nuestra plataforma",
               "Descarga cupones de descuento",
            ]}
         />
         <CompanyCard
            name="Roche"
            logo={rocheLogo}
            backgroundColor="bg-blue-50"
            buttonColor="bg-blue-200"
            textColor="text-blue-800"
            actions={[
               "Muestras de kits de diagnóstico",
               "Obtén acceso a una demo gratuita",
            ]}
         />
         <CompanyCard
            name="Merck & Co."
            logo={merckLogo}
            backgroundColor="bg-green-50"
            buttonColor="bg-green-200"
            textColor="text-green-700"
            actions={[
               "Prueba gratuita de nuestra plataforma",
               "Descarga cupones de descuento",
            ]}
         />
      </div>
   );
}
