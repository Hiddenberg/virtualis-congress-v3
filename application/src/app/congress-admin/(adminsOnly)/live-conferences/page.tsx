import { RadioIcon } from "lucide-react";
import LiveConferencesBrowser from "@/features/conferences/components/LiveConferencesBrowser";
import { getLiveConferencesGroupedByDay } from "@/features/conferences/services/conferenceServices";
import { getOrganizationBaseUrl } from "@/features/organizations/services/organizationServices";

export default async function LiveConferencesPage() {
   const baseUrl = await getOrganizationBaseUrl();
   const conferencesByDay = await getLiveConferencesGroupedByDay(baseUrl);

   return (
      <div className="p-6">
         <div className="mb-8">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Conferencias en vivo</h1>
            <p className="text-gray-600">Enlaces de transmisión para host e invitados. Selecciona el día para filtrar.</p>
         </div>

         {conferencesByDay.length === 0 ? (
            <div className="bg-white shadow-sm p-12 border border-gray-200 border-dashed rounded-xl text-center">
               <div className="flex justify-center items-center bg-blue-50 mx-auto mb-4 rounded-full w-16 h-16">
                  <RadioIcon className="w-8 h-8 text-blue-600" />
               </div>
               <h2 className="mb-2 font-semibold text-gray-900 text-lg">No hay conferencias en vivo</h2>
               <p className="text-gray-600">
                  Las conferencias con tipo &quot;En vivo&quot; o &quot;Presencial&quot; aparecerán aquí cuando estén programadas.
               </p>
            </div>
         ) : (
            <LiveConferencesBrowser conferencesByDay={conferencesByDay} />
         )}
      </div>
   );
}
