// import { DesktopOnlyWrapper } from "@/components/global/DesktopOnlyPageNotification";
// import SafariPopUp from "@/components/recorder/SafariPopUp";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
   return (
      <main className="relative flex w-full min-h-screen">
         {/* <LeftBar /> */}
         <div className="flex flex-col w-full overflow-y-auto">
            <div className="grow">{children}</div>
            <footer className="flex justify-between px-8 py-4 w-full text-gray-500">
               <Link href="/partners-demo/lobby" className="flex items-center gap-2 w-max">
                  <HomeIcon className="w-4 h-4" />
                  <span>Volver al lobby</span>
               </Link>
               <Link href="https://virtualis.app" target="_blank" className="flex items-center w-max">
                  <span>
                     www.<b>virtualis.app</b>
                  </span>
               </Link>
            </footer>
         </div>
      </main>
   );
}
