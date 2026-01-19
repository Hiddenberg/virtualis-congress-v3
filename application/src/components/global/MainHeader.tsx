import { Calendar } from "lucide-react";
import Image from "next/image";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";

export default async function MainHeader() {
   const organization = await getOrganizationFromSubdomain();
   const currentCongress = await getLatestCongress();
   return (
      <header className="relative flex md:flex-row flex-col justify-between items-center shadow-sm px-4 sm:px-6 md:px-6 lg:px-8 py-4 border-slate-200 w-full">
         {/* Mobile Home Button */}
         {/* <div className="md:hidden top-5 left-4 absolute">
            <Link href="/lobby"
               className="flex justify-center items-center hover:bg-slate-100 p-2 rounded-lg transition-colors"
            >
               <HomeIcon className="size-5 text-slate-600" />
            </Link>
         </div> */}

         {/* Logo section */}
         <div className="flex justify-center md:justify-start items-center w-full md:w-auto">
            <div className="flex items-center space-x-4">
               {organization.logoURL && (
                  <Image
                     width={414}
                     height={156}
                     src={organization.logoURL}
                     alt={`${organization.name} logo`}
                     className="w-32 md:w-48 h-auto"
                  />
               )}
            </div>
         </div>

         {/* Mobile event info */}
         <div
            className={`flex md:hidden flex-col items-center space-y-4 py-4 w-full`}
         >
            <div className="flex flex-col justify-center items-center px-4 w-full">
               <div className="bg-white shadow-sm border border-slate-200 rounded-xl w-full max-w-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-slate-200 border-b">
                     <div className="flex justify-center items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700 text-sm">
                           Evento actual
                        </span>
                     </div>
                  </div>
                  <div className="px-4 py-3">
                     <p className="font-semibold text-slate-800 text-sm text-center line-clamp-2">
                        {currentCongress?.title}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Desktop/Tablet event info */}
         <div className="hidden md:flex flex-col justify-center items-center md:mx-2 lg:mx-0 mt-0 w-auto lg:w-80 xl:w-96">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl w-full max-w-md overflow-hidden">
               <div className="bg-slate-50 px-4 py-2 border-slate-200 border-b">
                  <div className="flex justify-center items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-600" />
                     <span className="font-medium text-slate-700 text-sm">
                        Evento actual
                     </span>
                  </div>
               </div>
               <div className="px-4 py-3">
                  <p className="font-semibold text-slate-800 text-sm text-center line-clamp-2">
                     {currentCongress?.title}
                  </p>
               </div>
            </div>
         </div>

         {/* Desktop/Tablet right section - reserved for future use */}
         <div className="hidden md:flex items-center space-x-2 lg:space-x-4 w-auto lg:w-48">
            {/* Future: Help button, user menu, etc. */}
         </div>
      </header>
   );
}
