import { format } from "@formkit/tempo";
import { CheckCircle2, DollarSign, Users } from "lucide-react";
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

export default function PaidUsersList({ payments }: PaidUsersListProps) {
   const successful = (payments ?? []).filter((p) => p.fulfilledSuccessfully);
   const hasAny = successful.length > 0;
   const sorted = [...successful].sort((a, b) => {
      const aDate = new Date(a.fulfilledAt ?? a.created).getTime();
      const bDate = new Date(b.fulfilledAt ?? b.created).getTime();
      return bDate - aDate;
   });

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
         <div className="p-6 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="font-semibold text-gray-900 text-xl">Usuarios con Pago</h2>
                  <p className="mt-1 text-gray-600">Listado de pagos confirmados</p>
               </div>
               <div className="text-gray-600 text-sm">
                  Total: <span className="font-semibold text-gray-900">{successful.length}</span>
               </div>
            </div>
         </div>

         {!hasAny && (
            <div className="flex flex-col justify-center items-center p-12 text-center">
               <div className="flex justify-center items-center bg-gray-100 rounded-full w-14 h-14">
                  <Users className="w-7 h-7 text-gray-500" />
               </div>
               <p className="mt-4 font-medium text-gray-900">No hay pagos registrados</p>
               <p className="text-gray-600 text-sm">Cuando se confirmen pagos aparecerán aquí</p>
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
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Método</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider">Fecha</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                     {sorted.map((p) => {
                        const user = p.expand?.user;
                        const name = user?.name ?? "—";
                        const email = user?.email ?? "—";
                        const amount = formatMoney(p.totalAmount, p.currency);
                        const method = p.paymentMethod ? p.paymentMethod.replace(/_/g, " ") : "—";
                        // const paidAt = new Date(p.fulfilledAt ?? p.created)
                        //    .toLocaleDateString();
                        const paidAt = format({
                           date: p.fulfilledAt ?? p.created,
                           format: "DD/MM/YYYY hh:mm A",
                           locale: "es-MX",
                           tz: "America/Mexico_City",
                        });

                        return (
                           <tr key={p.id} className="hover:bg-gray-50">
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
