import Link from "next/link";
import type { CongressLandingConfiguration } from "@/features/congresses/types/congressLandingConfigurationsTypes";

interface RegistrationCTAColorClasses {
   sectionBgClass: string;
   buttonTextAccentClass: string;
}

const colorClasses: Record<CongressLandingConfiguration["colorScheme"], RegistrationCTAColorClasses> = {
   green: {
      sectionBgClass: "bg-linear-to-r from-green-800 via-green-600 to-green-400",
      buttonTextAccentClass: "text-lime-900",
   },
   blue: {
      sectionBgClass: "bg-linear-to-r from-blue-900 via-blue-700 to-cyan-600",
      buttonTextAccentClass: "text-blue-900",
   },
   purple: {
      sectionBgClass: "bg-linear-to-r from-purple-600 via-purple-400 to-purple-400",
      buttonTextAccentClass: "text-purple-900",
   },
};

interface RegistrationCTAProps {
   userId?: string;
   colorScheme: CongressLandingConfiguration["colorScheme"];
}

export default function RegistrationCTA({ userId, colorScheme }: RegistrationCTAProps) {
   return (
      <div className="px-4">
         <div className={`${colorClasses[colorScheme].sectionBgClass} mb-12 p-8 rounded-2xl text-white text-center`}>
            <h3 className="mb-4 font-bold text-3xl">¡INSCRÍBETE YA!</h3>
            <p className="mb-6 text-blue-100 text-lg">
               Asegura tu lugar en el congreso más importante de medicina interna en la región
            </p>
            <div className="flex sm:flex-row flex-col justify-center gap-4">
               {!userId && (
                  <Link
                     href="/signup"
                     className={`block bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold text-blue-900 text-center transition-colors ${colorClasses[colorScheme].buttonTextAccentClass}`}
                  >
                     Quiero Registrarme
                  </Link>
               )}
               <Link
                  href="/lobby"
                  className={`block text-center bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold ${colorClasses[colorScheme].buttonTextAccentClass} transition-colors`}
               >
                  Entrar con mi cuenta
               </Link>
            </div>
         </div>
      </div>
   );
}
