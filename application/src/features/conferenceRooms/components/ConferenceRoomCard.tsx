import { ArrowRightIcon, LayoutGrid, PencilIcon } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/global/Buttons";
import type { ConferenceRoomRecord } from "../types/conferenceRoomsTypes";
import DeleteConferenceRoomButton from "./DeleteConferenceRoomButton";

export default function ConferenceRoomCard({ conferenceRoom }: { conferenceRoom: ConferenceRoomRecord }) {
   return (
      <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
         <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-500 to-emerald-500" />

         <div className="flex items-center justify-between gap-3 px-5 pt-5">
            <div className="flex items-center gap-3">
               <div className="flex items-center justify-center rounded-xl bg-blue-50 w-12 h-12 text-blue-700 ring-1 ring-blue-100">
                  <LayoutGrid className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-gray-500 text-xs uppercase tracking-[0.16em]">Sala de conferencia</p>
                  <h2 className="font-semibold text-gray-900 text-xl">{conferenceRoom.name}</h2>
               </div>
            </div>

            <div className="flex items-center gap-1">
               <Link
                  href={`/congress-admin/conference-rooms/${conferenceRoom.id}/edit`}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
               >
                  <PencilIcon className="w-4 h-4" />
               </Link>
               <DeleteConferenceRoomButton conferenceRoomId={conferenceRoom.id} />
            </div>
         </div>

         <div className="px-5 py-5">
            <p className="min-h-16 text-gray-600 text-sm leading-relaxed">
               {conferenceRoom.description?.trim() || "Sin descripción. Añade una breve explicación para identificar mejor esta sala dentro del programa."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
               <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-500 text-xs uppercase tracking-[0.16em]">Identificador</p>
                  <p className="mt-1 font-medium text-gray-900 text-sm break-all">{conferenceRoom.id}</p>
               </div>
               <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-emerald-700 text-xs uppercase tracking-[0.16em]">Estado</p>
                  <p className="mt-1 font-medium text-emerald-900 text-sm">Disponible para asignar conferencias</p>
               </div>
            </div>
         </div>

         <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-gray-600 text-sm">Usa esta sala para agrupar sesiones que ocurran al mismo tiempo.</p>
            <LinkButton href={`/congress-admin/conference-rooms/${conferenceRoom.id}/edit`} variant="blue" className="px-4 py-2">
               Editar
               <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         </div>
      </article>
   );
}
