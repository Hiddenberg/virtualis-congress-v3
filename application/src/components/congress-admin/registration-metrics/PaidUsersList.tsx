import { CheckCircle2, Monitor, Users, Video } from "lucide-react";
import type { CongressUserRegistrationDetails } from "@/features/manualRegistration/services/manualRegistrationServices";

interface PaidUsersListProps {
   registrationsDetails: CongressUserRegistrationDetails[];
}

export default function PaidUsersList({ registrationsDetails }: PaidUsersListProps) {
   const paidUsers = registrationsDetails.filter((detail) => detail.hasPaid);
   const hasAny = paidUsers.length > 0;
   const sorted = [...paidUsers].sort((a, b) => {
      const aName = a.user.name?.toLowerCase() ?? "";
      const bName = b.user.name?.toLowerCase() ?? "";
      return aName.localeCompare(bName);
   });

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
         <div className="p-6 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="font-semibold text-gray-900 text-xl">Usuarios con Pago Confirmado</h2>
                  <p className="mt-1 text-gray-600">Detalles de modalidad y accesos</p>
               </div>
               <div className="text-gray-600 text-sm">
                  Total: <span className="font-semibold text-gray-900">{paidUsers.length}</span>
               </div>
            </div>
         </div>

         {!hasAny && (
            <div className="flex flex-col justify-center items-center p-12 text-center">
               <div className="flex justify-center items-center bg-gray-100 rounded-full w-14 h-14">
                  <Users className="w-7 h-7 text-gray-500" />
               </div>
               <p className="mt-4 font-medium text-gray-900">No hay usuarios con pago confirmado</p>
               <p className="text-gray-600 text-sm">Los usuarios con pago confirmado aparecerán aquí</p>
            </div>
         )}

         {hasAny && (
            <div className="max-h-96 overflow-x-auto">
               <table className="divide-y divide-gray-200 min-w-full">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Pago</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">
                           Modalidad
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-center uppercase tracking-wider">
                           Grabaciones
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                     {sorted.map((detail) => {
                        const name = detail.user.name ?? "—";
                        const email = detail.user.email ?? "—";
                        const modality =
                           detail.attendanceModality === "in-person"
                              ? "Presencial"
                              : detail.attendanceModality === "virtual"
                                ? "Virtual"
                                : "No especificada";
                        const hasRecordings = detail.hasAccessToRecordings;

                        return (
                           <tr key={detail.user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="font-medium text-gray-900 text-sm">{name}</div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="text-gray-700 text-sm">{email}</div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700 text-sm">Confirmado</span>
                                 </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="flex items-center gap-2">
                                    {detail.attendanceModality === "in-person" ? (
                                       <>
                                          <Users className="w-4 h-4 text-blue-600" />
                                          <span className="text-blue-700 text-sm">{modality}</span>
                                       </>
                                    ) : detail.attendanceModality === "virtual" ? (
                                       <>
                                          <Monitor className="w-4 h-4 text-green-600" />
                                          <span className="text-green-700 text-sm">{modality}</span>
                                       </>
                                    ) : (
                                       <span className="text-gray-600 text-sm">{modality}</span>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-3 text-center whitespace-nowrap">
                                 {hasRecordings ? (
                                    <div className="inline-flex justify-center items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-full">
                                       <Video className="w-3.5 h-3.5 text-purple-600" />
                                       <span className="font-medium text-purple-700 text-xs">Sí</span>
                                    </div>
                                 ) : (
                                    <span className="text-gray-400 text-sm">—</span>
                                 )}
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
