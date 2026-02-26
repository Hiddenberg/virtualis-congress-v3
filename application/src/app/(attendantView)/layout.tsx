// import { DesktopOnlyWrapper } from "@/components/global/DesktopOnlyPageNotification";

import { headers } from "next/headers";
// import SafariPopUp from "@/components/recorder/SafariPopUp";
import Link from "next/link";
import { redirect } from "next/navigation";
import LeftBar from "@/components/global/LeftBar";
import ConferenceNotificationController from "@/features/conferenceNotifications/components/ConferenceNotificationController";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
   const headersList = await headers();
   const currentPath = headersList.get("x-current-path") ?? "/lobby";

   const user = await getLoggedInUserId();

   if (!user) {
      return redirect(`/login?redirectTo=${currentPath}`);
   }

   return (
      <main className="relative flex w-full min-h-screen">
         <ConferenceNotificationController />
         <LeftBar />
         <div className="flex flex-col w-full overflow-y-auto">
            <div className="grow">{children}</div>
            <footer className="flex justify-end px-8 py-4 w-full text-gray-500">
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
