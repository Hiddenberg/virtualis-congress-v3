import { Calendar, CreditCard, TrendingUp } from "lucide-react";
import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";

interface UserPayment {
   organization: string;
   user: string;
   stripeCheckoutSessionId: string;
   checkoutSessionStatus: "open" | "complete" | "expired";
   fulfilledSuccessfully: boolean;
   fulfilledAt?: string;
   totalAmount?: number;
   discount?: number;
   currency?: string;
   paymentMethod?: string;
}

type UserPaymentRecord = UserPayment & {
   id: string;
   created: string;
   updated: string;
};

interface DetailedMetricsGridProps {
   registrations: CongressRegistrationRecord[];
   payments: UserPaymentRecord[];
}

export default function DetailedMetricsGrid({
   registrations,
   payments,
}: DetailedMetricsGridProps) {
   const regularRegistrations = registrations.filter(
      (reg) => reg.registrationType === "regular",
   );
   const courtesyRegistrations = registrations.filter(
      (reg) => reg.registrationType === "courtesy",
   );

   const successfulPayments = payments.filter(
      (payment) => payment.fulfilledSuccessfully,
   );
   // Group by currency (lowercase; optional). Missing currency grouped as "sin-moneda".
   const sumsByCurrency = successfulPayments.reduce(
      (acc, payment) => {
         const key = (payment.currency ?? "sin-moneda").toLowerCase();
         const prev = acc[key] ?? {
            revenue: 0,
            discount: 0,
         };
         acc[key] = {
            revenue: prev.revenue + (payment.totalAmount || 0),
            discount: prev.discount + (payment.discount || 0),
         };
         return acc;
      },
      {} as Record<string, { revenue: number; discount: number }>,
   );
   const totalDiscount = Object.values(sumsByCurrency).reduce(
      (sum, v) => sum + v.discount,
      0,
   );

   const recentPayments = successfulPayments.filter((payment) => {
      const paymentDate = new Date(payment.fulfilledAt || payment.created);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return paymentDate >= sevenDaysAgo;
   }).length;

   const metrics = [
      {
         title: "Registros Regulares",
         value: regularRegistrations.length,
         subtitle: `${registrations.length > 0 ? Math.round((regularRegistrations.length / registrations.length) * 100) : 0}% del total`,
         icon: CreditCard,
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
      // {
      //    title: "Invitaciones de Cortesía",
      //    value: courtesyRegistrations.length,
      //    subtitle: `${registrations.length > 0 ? Math.round((courtesyRegistrations.length / registrations.length) * 100) : 0}% del total`,
      //    icon: Gift,
      //    color: "text-purple-600",
      //    bgColor: "bg-purple-50"
      // },
      {
         title: "Descuentos Aplicados",
         value: `$${(totalDiscount / 100).toFixed(2)}`,
         subtitle: `En ${successfulPayments.filter((p) => p.discount && p.discount > 0).length} pagos`,
         icon: TrendingUp,
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         title: "Pagos Recientes",
         value: recentPayments,
         subtitle: "Últimos 7 días",
         icon: Calendar,
         color: "text-orange-600",
         bgColor: "bg-orange-50",
      },
   ];

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">
               Métricas Detalladas
            </h2>
            <p className="mt-1 text-gray-600">
               Información adicional sobre registros y pagos
            </p>
         </div>

         <div className="p-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {metrics.map((metric, index) => (
                  <div
                     key={index}
                     className={`p-4 rounded-lg ${metric.bgColor}`}
                  >
                     <div className="flex justify-between items-center mb-3">
                        <div
                           className={`p-2 rounded-lg bg-white ${metric.color}`}
                        >
                           <metric.icon className="w-5 h-5" />
                        </div>
                     </div>
                     <div className="mb-1 font-bold text-gray-900 text-2xl">
                        {typeof metric.value === "number"
                           ? metric.value.toLocaleString()
                           : metric.value}
                     </div>
                     <div className="mb-1 font-medium text-gray-700 text-sm">
                        {metric.title}
                     </div>
                     <div className="text-gray-600 text-xs">
                        {metric.subtitle}
                     </div>
                  </div>
               ))}
            </div>

            {/* Summary Section */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mt-8">
               <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                     Resumen de Ingresos
                  </h3>
                  <div className="space-y-3">
                     {Object.keys(sumsByCurrency)
                        .sort()
                        .map((cur) => {
                           const sums = sumsByCurrency[cur];
                           const gross = (sums.revenue + sums.discount) / 100;
                           const disc = sums.discount / 100;
                           const net = sums.revenue / 100;
                           const label =
                              cur === "sin-moneda"
                                 ? "Sin moneda"
                                 : cur.toUpperCase();
                           return (
                              <div
                                 key={cur}
                                 className="bg-white p-3 border border-gray-100 rounded"
                              >
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700 text-xs">
                                       {label}
                                    </span>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                       <span className="text-gray-600">
                                          Ingresos Brutos:
                                       </span>
                                       <span className="font-medium">
                                          ${gross.toFixed(2)}
                                       </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                       <span className="text-gray-600">
                                          Descuentos Aplicados:
                                       </span>
                                       <span className="font-medium text-red-600">
                                          -${disc.toFixed(2)}
                                       </span>
                                    </div>
                                    <hr className="my-1" />
                                    <div className="flex justify-between font-semibold text-base">
                                       <span className="text-gray-900">
                                          Ingresos Netos:
                                       </span>
                                       <span className="text-green-600">
                                          ${net.toFixed(2)}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     {Object.keys(sumsByCurrency).length === 0 && (
                        <div className="text-gray-600 text-sm">
                           Sin ingresos registrados
                        </div>
                     )}
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                     Tipos de Registro
                  </h3>
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Regulares:</span>
                        <span className="font-medium">
                           {regularRegistrations.length}
                        </span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cortesías:</span>
                        <span className="font-medium">
                           {courtesyRegistrations.length}
                        </span>
                     </div>
                     <hr className="my-2" />
                     <div className="flex justify-between font-semibold text-base">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">
                           {registrations.length}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
