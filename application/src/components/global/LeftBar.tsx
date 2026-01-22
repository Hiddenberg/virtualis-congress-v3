import { Bell, Home, LayoutGrid, Store, TvMinimalPlay } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "../registration/AuthHeader";
import { LinkButton } from "./Buttons";

function LeftBar() {
   return (
      <div className="hidden top-0 left-0 sticky md:flex flex-col justify-between bg-slate-50 px-3 py-6 md:py-8 lg:py-10 border-slate-200 border-r w-16 md:w-20 lg:w-24 h-screen overflow-hidden">
         <div className="flex flex-col justify-center items-center overflow-hidden grow">
            <nav className="z-50 flex flex-col items-center space-y-4 bg-white shadow-sm p-4 border border-slate-200 rounded-2xl overflow-hidden">
               <Link
                  className="group flex justify-center items-center hover:bg-slate-100 p-2 rounded-xl transition-colors"
                  href="/lobby"
               >
                  <Home className="size-6 text-slate-600 group-hover:text-slate-800" />
               </Link>

               <div className="self-center border-slate-300 border-b w-8" />

               <LinkButton
                  disabled
                  variant="none"
                  className="group flex justify-center items-center hover:bg-slate-100 p-2 rounded-xl transition-colors"
                  href="/lobby"
               >
                  <LayoutGrid className="size-6 text-slate-600 group-hover:text-slate-800" />
               </LinkButton>

               <LinkButton
                  disabled
                  className="group flex justify-center items-center hover:bg-slate-100 p-2 rounded-xl transition-colors"
                  href="/lobby"
               >
                  <Store className="size-6 text-slate-600 group-hover:text-slate-800" />
               </LinkButton>

               <LinkButton
                  disabled
                  className="group flex justify-center items-center hover:bg-slate-100 p-2 rounded-xl transition-colors"
                  href="/lobby"
               >
                  <TvMinimalPlay className="size-6 text-slate-600 group-hover:text-slate-800" />
               </LinkButton>
            </nav>
         </div>

         <div className="flex flex-col justify-center items-center space-y-4 h-32">
            <button
               type="button"
               className="flex justify-center items-center bg-white hover:bg-slate-50 p-2 border border-slate-200 rounded-xl transition-colors"
            >
               <Bell className="size-5 text-slate-600" />
            </button>
            <LogoutButton />
         </div>
      </div>
   );
}

export default LeftBar;
