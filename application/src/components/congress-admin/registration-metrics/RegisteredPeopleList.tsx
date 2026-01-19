import { format } from "@formkit/tempo";
import { CheckCircle2, Users, XCircle } from "lucide-react";
import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";

interface RegisteredPeopleListProps {
   registrations: CongressRegistrationRecord[];
}

export default function RegisteredPeopleList({
   registrations,
}: RegisteredPeopleListProps) {
   const hasAny = registrations.length > 0;

   const sorted = [...registrations].sort((a, b) => {
      const aDate = new Date(a.created).getTime();
      const bDate = new Date(b.created).getTime();
      return bDate - aDate;
   });

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
         <div className="p-6 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="font-semibold text-gray-900 text-xl">
                     Personas Registradas
                  </h2>
                  <p className="mt-1 text-gray-600">
                     Listado de asistentes al congreso
                  </p>
               </div>
               <div className="text-gray-600 text-sm">
                  Total:{" "}
                  <span className="font-semibold text-gray-900">
                     {registrations.length}
                  </span>
               </div>
            </div>
         </div>

         {!hasAny && (
            <div className="flex flex-col justify-center items-center p-12 text-center">
               <div className="flex justify-center items-center bg-gray-100 rounded-full w-14 h-14">
                  <Users className="w-7 h-7 text-gray-500" />
               </div>
               <p className="mt-4 font-medium text-gray-900">
                  No hay registros aún
               </p>
               <p className="text-gray-600 text-sm">
                  Aparecerán aquí las personas registradas al congreso
               </p>
            </div>
         )}

         {hasAny && (
            <div className="max-h-96 overflow-x-auto">
               <table className="divide-y divide-gray-200 min-w-full">
                  <thead className="bg-gray-50">
                     <tr>
                        <th
                           scope="col"
                           className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
                        >
                           Nombre
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
                        >
                           Email
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
                        >
                           Pago
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
                        >
                           Modalidad
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
                        >
                           Fecha de Registro
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                     {sorted.map((reg) => {
                        const user = (
                           reg as unknown as { expand?: { user?: UserRecord } }
                        )?.expand?.user;
                        const name = user?.name ?? "—";
                        const email = user?.email ?? "—";
                        const isPaid = !!reg.paymentConfirmed;
                        const modality =
                           reg.attendanceModality === "in-person"
                              ? "Presencial"
                              : reg.attendanceModality === "virtual"
                                ? "Virtual"
                                : "No especificada";
                        const createdAt = new Date(reg.created);
                        const createdLabel = format({
                           date: createdAt,
                           format: "DD/MM/YYYY hh:mm A",
                           locale: "es-MX",
                           tz: "America/Mexico_City",
                        });

                        return (
                           <tr key={reg.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="font-medium text-gray-900 text-sm">
                                    {name}
                                 </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="text-gray-700 text-sm">
                                    {email}
                                 </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="flex items-center gap-2">
                                    {isPaid ? (
                                       <>
                                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          <span className="text-green-700 text-sm">
                                             Pagado
                                          </span>
                                       </>
                                    ) : (
                                       <>
                                          <XCircle className="w-4 h-4 text-gray-400" />
                                          <span className="text-gray-600 text-sm">
                                             Pendiente
                                          </span>
                                       </>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <span className="text-gray-700 text-sm">
                                    {modality}
                                 </span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <span className="text-gray-700 text-sm">
                                    {createdLabel}
                                 </span>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}
