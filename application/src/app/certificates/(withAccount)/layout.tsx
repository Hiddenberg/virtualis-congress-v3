import { Calendar, ChevronLeft, Cloud, FileText, Home, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";
import MobileMenuToggle from "./MobileMenuToggle";

export default async function CertificatesLayout({ children }: { children: React.ReactNode }) {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user) {
      redirect("/login?redirectTo=/certificates");
   }

   return (
      <div className="flex md:flex-row flex-col mx-auto max-w-screen-2xl h-full min-h-screen">
         {/* Mobile Menu Button - Only visible on mobile */}
         <div className="md:hidden flex justify-between items-center bg-linear-to-br from-[#DEEDFD] to-[#F1EAFB] p-4">
            <div className="flex items-center">
               <h1 className="font-bold text-indigo-700 text-xl leading-none">virtualis</h1>
               <p className="ml-2 font-light text-indigo-700 text-sm">Certificates</p>
            </div>
            <MobileMenuToggle />
         </div>

         {/* Sidebar */}
         <aside
            id="sidebar"
            className="hidden top-0 left-0 z-50 fixed md:relative md:flex flex-col bg-linear-to-br from-[#DEEDFD] to-[#F1EAFB] shadow-md w-full md:w-64 h-screen md:h-auto"
         >
            <div className="md:block flex justify-between items-center p-4 md:p-6">
               <div className="md:flex md:flex-col md:items-center md:mb-8">
                  <h1 className="font-bold text-indigo-700 text-2xl leading-none">virtualis</h1>
                  <p className="font-light text-indigo-700 text-lg">Certificates</p>
               </div>

               {/* Close button - Only visible on mobile */}
               <MobileMenuToggle isCloseButton />
            </div>

            <nav className="flex flex-col flex-1 space-y-2 px-3 overflow-y-auto">
               <Link
                  href="/"
                  className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg text-gray-600 hover:text-indigo-700 pointer-events-none select-none"
               >
                  <div className="flex justify-center items-center w-6 h-6">
                     <Home size={20} />
                  </div>
                  <span>Inicio</span>
               </Link>

               <Link
                  href="/"
                  className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg text-gray-600 hover:text-indigo-700 pointer-events-none select-none"
               >
                  <div className="flex justify-center items-center w-6 h-6">
                     <FileText size={20} />
                  </div>
                  <span>Formularios</span>
               </Link>

               <Link href="/certificates/" className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg text-indigo-700">
                  <div className="flex justify-center items-center w-6 h-6">
                     <Calendar size={20} />
                  </div>
                  <span>Certificados</span>
               </Link>

               <Link
                  href="/"
                  className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg text-gray-600 hover:text-indigo-700 pointer-events-none select-none"
               >
                  <div className="flex justify-center items-center w-6 h-6">
                     <Cloud size={20} />
                  </div>
                  <span>Nube</span>
               </Link>
            </nav>

            <div className="mt-auto p-4">
               <Link
                  href="https://virtualis.app"
                  target="_blank"
                  className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg w-full text-white"
               >
                  <span className="mr-2 text-sm md:text-base">Crea tus propios certificados</span>
                  <SquareArrowOutUpRight className="size-5 md:size-6" />
               </Link>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 bg-linear-to-br from-[#D6E8FC] to-[#EDD9E9] overflow-auto">
            {/* Navigation */}
            <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4 sm:gap-0 p-4 sm:p-6">
               <div className="flex items-center">
                  <Link
                     href="/lobby"
                     className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                     <ChevronLeft size={20} />
                     <span className="text-sm sm:text-base">Volver a Virtualis Congress</span>
                  </Link>
               </div>

               {/* <div className="flex items-center space-x-4 sm:ml-auto w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                     <Search size={18} className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" />
                     <input 
                        type="text" 
                        placeholder="Buscar" 
                        className="bg-white shadow-sm py-2 pr-4 pl-10 border-none rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-72"
                     />
                  </div>
                  
                  <button className="flex justify-center items-center bg-gray-200 rounded-full w-8 h-8 text-gray-600 shrink-0">
                     <User size={16} />
                  </button>
               </div> */}
            </div>

            <div className="p-4 sm:p-6">{children}</div>
         </main>
      </div>
   );
}
