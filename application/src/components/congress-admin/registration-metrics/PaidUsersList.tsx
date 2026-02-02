import { format } from "@formkit/tempo";
import { CheckCircle2, DollarSign, Monitor, Users, Video } from "lucide-react";
import type { CongressUserRegistrationDetails } from "@/features/manualRegistration/services/manualRegistrationServices";
import type { UserRecord } from "@/features/users/types/userTypes";

interface UserPaymentRecord {
   id: string;
   organization: string;
   user: string;
   stripeCheckoutSessionId: string;
   checkoutSessionStatus: "open" | "complete" | "expired";
   fulfilledSuccessfully: boolean;
   fulfilledAt?: string;
   totalAmount?: number; // cents
   discount?: number; // cents
   currency?: string; // e.g., "mxn", "usd"
   paymentMethod?: string;
   created: string;
   updated: string;
   expand?: {
      user?: UserRecord;
   };
}

interface PaidUsersListProps {
   registrationsDetails: CongressUserRegistrationDetails[];
   payments: UserPaymentRecord[];
}

const formatMoney = (amountCents: number | undefined, currency?: string) => {
   const amount = (amountCents ?? 0) / 100;
   const code = (currency ?? "USD").toUpperCase();
   try {
      return new Intl.NumberFormat(undefined, {
         style: "currency",
         currency: code,
         maximumFractionDigits: 2,
      }).format(amount);
   } catch {
      return `$${amount.toFixed(2)}`;
   }
};

export default function PaidUsersList({ registrationsDetails, payments }: PaidUsersListProps) {
   const paidUsers = registrationsDetails.filter((detail) => detail.hasPaid);
   const hasAny = paidUsers.length > 0;

   // Create a map of payments by user ID for quick lookup
   const paymentsByUserId = new Map<string, UserPaymentRecord>();
   payments
      .filter((p) => p.fulfilledSuccessfully)
      .forEach((payment) => {
         paymentsByUserId.set(payment.user, payment);
      });

   const sorted = [...paidUsers].sort((a, b) => {
      const paymentA = paymentsByUserId.get(a.user.id);
      const paymentB = paymentsByUserId.get(b.user.id);

      const dateA = paymentA ? (paymentA.fulfilledAt ?? paymentA.created) : "";
      const dateB = paymentB ? (paymentB.fulfilledAt ?? paymentB.created) : "";

      // Sort by payment date descending (most recent first)
      // If no payment date, put at the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return new Date(dateB).getTime() - new Date(dateA).getTime();
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
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Monto</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">
                           Modalidad
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-center uppercase tracking-wider">
                           Grabaciones
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Método</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">
                           Fecha de Pago
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                     {sorted.map((detail) => {
                        const name = detail.user.name ?? "—";
                        const email = detail.user.email ?? "—";
                        const payment = paymentsByUserId.get(detail.user.id);
                        const amount = payment ? formatMoney(payment.totalAmount, payment.currency) : "—";
                        const method = payment?.paymentMethod ? payment.paymentMethod.replace(/_/g, " ") : "—";
                        const paidAt = payment
                           ? format({
                                date: payment.fulfilledAt ?? payment.created,
                                format: "DD/MM/YYYY hh:mm A",
                                locale: "es-MX",
                                tz: "America/Mexico_City",
                             })
                           : "—";
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
                                 <div className="flex items-center gap-2 text-green-700 text-sm">
                                    <DollarSign className="w-4 h-4" />
                                    {amount}
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
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <span className="text-gray-700 text-sm capitalize">{method}</span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                 <div className="flex items-center gap-2 text-gray-700 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    {paidAt}
                                 </div>
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
