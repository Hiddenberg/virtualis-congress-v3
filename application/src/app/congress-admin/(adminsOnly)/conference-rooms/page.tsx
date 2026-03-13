import { LayoutGrid, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import ConferenceRoomCard from "@/features/conferenceRooms/components/ConferenceRoomCard";
import ConferenceRoomsBrowser from "@/features/conferenceRooms/components/ConferenceRoomsBrowser";
import { getAllCongressConferenceRooms } from "@/features/conferenceRooms/services/conferenceRoomsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

function SummaryCard({ label, value, description }: { label: string; value: number; description: string }) {
   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
         <p className="text-gray-500 text-xs uppercase tracking-[0.16em]">{label}</p>
         <p className="mt-3 font-bold text-3xl text-gray-900">{value}</p>
         <p className="mt-2 text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
   );
}

export default async function ConferenceRoomsPage() {
   const congress = await getLatestCongress();
   const conferenceRooms = await getAllCongressConferenceRooms(congress.id);

   const roomsWithDescriptionCount = conferenceRooms.filter((conferenceRoom) =>
      Boolean(conferenceRoom.description?.trim()),
   ).length;
   const roomsWithoutDescriptionCount = conferenceRooms.length - roomsWithDescriptionCount;

   return (
      <div className="space-y-8 p-6">
         <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-cyan-50 shadow-sm">
            <div className="flex xl:flex-row flex-col xl:justify-between xl:items-center gap-6 p-8">
               <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-blue-700 text-sm">
                     <LayoutGrid className="w-4 h-4" />
                     <span>Salas del congreso actual</span>
                  </div>
                  <h1 className="mt-4 mb-3 font-bold text-4xl text-gray-900">Salas de conferencia</h1>
                  <p className="max-w-2xl text-gray-600 leading-relaxed">
                     Organiza mejor tu evento creando salas para separar conferencias simultáneas, mantener el programa claro y
                     preparar la experiencia multi-room que quieres construir.
                  </p>
                  <p className="mt-4 text-blue-700 text-sm">
                     Congreso activo: <span className="font-semibold">{congress.title}</span>
                  </p>
               </div>

               <div className="flex sm:flex-row flex-col gap-3">
                  <Link
                     href="/congress-admin/conference-rooms/create"
                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                     <Plus className="w-4 h-4" />
                     <span>Nueva sala</span>
                  </Link>
               </div>
            </div>
         </section>

         <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard
               label="Total"
               value={conferenceRooms.length}
               description="Número de salas disponibles para organizar la programación de este congreso."
            />
            <SummaryCard
               label="Con descripción"
               value={roomsWithDescriptionCount}
               description="Salas con contexto adicional para que el equipo las identifique más rápido."
            />
            <SummaryCard
               label="Por completar"
               value={roomsWithoutDescriptionCount}
               description="Salas que todavía podrían beneficiarse de una breve descripción."
            />
         </section>

         {conferenceRooms.length === 0 ? (
            <section className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Sparkles className="w-8 h-8" />
               </div>
               <h2 className="mt-5 font-semibold text-gray-900 text-2xl">Aún no hay salas registradas</h2>
               <p className="mx-auto mt-3 max-w-2xl text-gray-600 leading-relaxed">
                  Crea tu primera sala para empezar a estructurar el congreso por espacios. Esto te ayudará a preparar mejor
                  sesiones simultáneas y una navegación más clara para asistentes y organizadores.
               </p>
               <Link
                  href="/congress-admin/conference-rooms/create"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
               >
                  <Plus className="w-4 h-4" />
                  <span>Crear primera sala</span>
               </Link>
            </section>
         ) : (
            <ConferenceRoomsBrowser conferenceRooms={conferenceRooms}>
               {conferenceRooms.map((conferenceRoom) => (
                  <ConferenceRoomCard key={conferenceRoom.id} conferenceRoom={conferenceRoom} />
               ))}
            </ConferenceRoomsBrowser>
         )}
      </div>
   );
}
