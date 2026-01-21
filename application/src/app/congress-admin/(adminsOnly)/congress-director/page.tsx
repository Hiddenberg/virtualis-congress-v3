import Link from "next/link";
import { getActiveAndNextConferences } from "@/features/congressDirector/services/congressDirectorServices";

export default async function CongressDirectorPage() {
   const activeNext = await getActiveAndNextConferences();
   const activeConference = activeNext.activeConference;
   const nextConference = activeNext.nextConference;

   return (
      <div className="space-y-4">
         <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900 text-base">Estado general</h2>
            <div className="gap-3 grid md:grid-cols-2 mt-3">
               <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-gray-200">
                  <p className="font-medium text-gray-700 text-sm">Conferencia activa</p>
                  {activeConference ? (
                     <Link
                        href={`/congress-admin/congress-director/${activeConference.id}`}
                        className="text-blue-700 text-sm hover:underline"
                     >
                        {activeConference.title}
                     </Link>
                  ) : (
                     <p className="text-gray-600 text-sm">No hay conferencia activa</p>
                  )}
               </div>
               <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-gray-200">
                  <p className="font-medium text-gray-700 text-sm">Siguiente</p>
                  {nextConference ? (
                     <Link
                        href={`/congress-admin/congress-director/${nextConference.id}`}
                        className="text-blue-700 text-sm hover:underline"
                     >
                        {nextConference.title}
                     </Link>
                  ) : (
                     <p className="text-gray-600 text-sm">No hay próxima conferencia</p>
                  )}
               </div>
            </div>
         </section>
         <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900 text-base">Cómo funciona</h2>
            <p className="mt-1 text-gray-600 text-sm">
               Selecciona una conferencia en la lista para administrarla: iniciar, finalizar o acceder a accesos directos.
            </p>
         </section>
      </div>
   );
}
