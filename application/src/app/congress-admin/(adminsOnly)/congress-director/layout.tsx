import { VideoIcon } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/global/Buttons";
import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import DirectorSidebarList from "@/features/congressDirector/components/DirectorSidebarList";
import StandbyButton from "@/features/congressDirector/components/StandbyButton";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonState";

export default async function CongressDirectorLayout({ children }: { children: React.ReactNode }) {
   const [congress, activeNext, inPersonState] = await Promise.all([
      getLatestCongress(),
      getActiveAndNextConferences(),
      ensuredCongressInPersonState(),
   ]);
   const allCongressConferences = await getAllCongressConferences(congress.id);
   const activeConference = activeNext.activeConference;
   const nextConference = activeNext.nextConference;

   return (
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-[320px_1fr]">
         <aside className="bg-white p-4 rounded-xl ring-1 ring-gray-200">
            <div className="flex justify-between items-center">
               <h2 className="font-semibold text-gray-900 text-base">Conferencias</h2>
               <StandbyButton isInitiallyStandby={inPersonState.status === "standby"} />
            </div>

            <div className="space-y-2 mt-3">
               {activeConference ? (
                  <Link href={`/congress-admin/congress-director/${activeConference.id}`} className="block">
                     <div className="flex items-start gap-2 bg-green-50 px-3 py-2 rounded-lg ring-1 ring-green-200">
                        <span className="bg-green-600 mt-1 rounded-full w-1.5 h-1.5" />
                        <div className="min-w-0">
                           <p className="font-medium text-green-900 text-sm truncate">Conferencia activa</p>
                           <p className="text-green-800 text-sm truncate">{activeConference.title}</p>
                        </div>
                     </div>
                  </Link>
               ) : (
                  <div className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-lg ring-1 ring-gray-200">
                     <span className="bg-gray-400 mt-1 rounded-full w-1.5 h-1.5" />
                     <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm">Sin conferencia activa</p>
                        <p className="text-gray-600 text-xs">Estado: {inPersonState.status}</p>
                     </div>
                  </div>
               )}

               {nextConference && (
                  <Link href={`/congress-admin/congress-director/${nextConference.id}`} className="block">
                     <div className="flex items-start gap-2 bg-blue-50 px-3 py-2 rounded-lg ring-1 ring-blue-200">
                        <span className="bg-blue-600 mt-1 rounded-full w-1.5 h-1.5" />
                        <div className="min-w-0">
                           <p className="font-medium text-blue-900 text-sm truncate">Siguiente</p>
                           <p className="text-blue-800 text-sm truncate">{nextConference.title}</p>
                        </div>
                     </div>
                  </Link>
               )}
            </div>

            <div className="bg-gray-200 mt-4 h-px" />

            <DirectorSidebarList conferences={allCongressConferences} />
         </aside>

         <main>
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h1 className="font-semibold text-gray-900 text-xl">Director del congreso</h1>
                  <p className="text-gray-600 text-sm">Gestiona el estado de las conferencias</p>
               </div>
               <LinkButton href="/congress-admin/camera-call" variant="blue" className="text-sm">
                  <VideoIcon className="w-4 h-4" />
                  Ir a la llamada de cámara
               </LinkButton>
               {/* {activeConference && (
                  <span className="bg-green-50 px-2.5 py-1 rounded-md ring-1 ring-green-200 font-medium text-green-800 text-xs">
                     En curso
                  </span>
               )} */}
            </div>
            {children}
         </main>
      </div>
   );
}
