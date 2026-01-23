import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import AdminConferenceCard from "@/features/conferences/components/AdminConferenceCard";
import AdminConferencesBrowser from "@/features/conferences/components/AdminConferencesBrowser";
import { getAllConferencePresentations } from "@/features/conferences/services/conferencePresentationsServices";
import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function ConferencesPage() {
   const congress = await getLatestCongress();
   const conferences = await getAllCongressConferences(congress.id);
   const conferencePresentations = await getAllConferencePresentations();

   return (
      <div className="p-6">
         <div className="flex justify-between items-start mb-8">
            <div>
               <h1 className="mb-2 font-bold text-gray-900 text-3xl">Conferencias</h1>
               <p className="text-gray-600">Administra las conferencias del congreso actual</p>
            </div>
            <Link
               href="/congress-admin/conferences/create"
               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
               <Plus className="w-4 h-4" />
               <span>Nueva conferencia</span>
            </Link>
         </div>

         {conferences.length === 0 ? (
            <div className="bg-white shadow-sm p-10 border border-gray-300 border-dashed rounded-xl text-center">
               <div className="flex justify-center items-center bg-blue-50 mx-auto mb-4 rounded-full w-12 h-12">
                  <Calendar className="w-6 h-6 text-blue-600" />
               </div>
               <h2 className="mb-2 font-semibold text-gray-900 text-lg">Aún no hay conferencias</h2>
               <p className="mb-6 text-gray-600">Crea tu primera conferencia para comenzar a organizar el programa</p>
               <Link
                  href="/congress-admin/conferences/create"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
               >
                  <Plus className="w-4 h-4" />
                  <span>Crear conferencia</span>
               </Link>
            </div>
         ) : (
            <AdminConferencesBrowser conferences={conferences}>
               {conferences.map((conference) => {
                  const conferencePresentation = conferencePresentations.find(
                     (presentation) => presentation.conference === conference.id,
                  );

                  return (
                     <AdminConferenceCard
                        key={conference.id}
                        conference={conference}
                        presentation={conferencePresentation?.presentation}
                     />
                  );
               })}
            </AdminConferencesBrowser>
         )}
      </div>
   );
}
