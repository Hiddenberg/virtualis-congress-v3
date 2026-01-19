import { Calendar, DollarSign, UserCheck, Users } from "lucide-react";
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

interface RegistrationOverviewProps {
   registrations: CongressRegistrationRecord[];
   payments: UserPaymentRecord[];
}

export default function RegistrationOverview({
   registrations,
   payments,
}: RegistrationOverviewProps) {
   const totalRegistrations = registrations.length;

   // Create a map of payments by ID for quick lookup
   const paymentsMap = new Map(
      payments.map((payment) => [payment.id, payment]),
   );

   // Separate registrations with payment confirmed into:
   // - Those with actual payments (> 0)
   // - Those with zero payments (= 0 or null/undefined)
   const registrationsWithPayment = registrations.filter(
      (reg) => reg.paymentConfirmed,
   );
   const paidRegistrationsWithAmount = registrationsWithPayment.filter(
      (reg) => {
         if (!reg.payment) return false;
         const payment = paymentsMap.get(reg.payment);
         return payment && (payment.totalAmount ?? 0) > 0;
      },
   );
   const paidRegistrationsZeroAmount = registrationsWithPayment.filter(
      (reg) => {
         if (!reg.payment) return false;
         const payment = paymentsMap.get(reg.payment);
         return payment && (payment.totalAmount ?? 0) === 0;
      },
   );

   const paidRegistrations = paidRegistrationsWithAmount.length;
   const freeRegistrations = paidRegistrationsZeroAmount.length;
   const totalPaidRegistrations = paidRegistrations + freeRegistrations;
   const paidPercentage =
      totalRegistrations > 0
         ? Math.round((totalPaidRegistrations / totalRegistrations) * 100)
         : 0;

   // Group successful payments by currency (lowercase like "mxn", "usd").
   // Currency is optional; group missing as "sin-moneda".
   const revenueByCurrency = payments
      .filter(
         (payment) =>
            payment.fulfilledSuccessfully && (payment.totalAmount ?? 0) > 0,
      )
      .reduce(
         (acc, payment) => {
            const key = (payment.currency ?? "sin-moneda").toLowerCase();
            acc[key] = (acc[key] ?? 0) + (payment.totalAmount || 0);
            return acc;
         },
         {} as Record<string, number>,
      );

   const formatMoney = (amountCents: number, currencyKey: string) => {
      const amount = (amountCents ?? 0) / 100;
      const isUnknown = currencyKey === "sin-moneda";
      const code = isUnknown ? undefined : currencyKey.toUpperCase();
      try {
         if (!code) throw new Error("no-code");
         return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: code,
            maximumFractionDigits: 2,
         }).format(amount);
      } catch {
         return `$${amount.toFixed(2)}`;
      }
   };

   const stats = [
      // Typed via StatItem union below
      {
         title: "Total Registrados",
         value: totalRegistrations.toLocaleString(),
         icon: Users,
         color: "bg-blue-50 text-blue-600",
         bgColor: "bg-blue-500",
      },
      {
         title: "Pagos Confirmados",
         icon: UserCheck,
         color: "bg-green-50 text-green-600",
         bgColor: "bg-green-500",
         subtitle: `${paidPercentage}% del total de registrados`,
         paymentBreakdown: {
            "Inscritos con pago": paidRegistrations,
            "Inscritos gratis": freeRegistrations,
            Total: totalPaidRegistrations,
         },
      },
      // Render currency-separated totals inside this stat card
      {
         title: "Ingresos Totales",
         icon: DollarSign,
         color: "bg-purple-50 text-purple-600",
         bgColor: "bg-purple-500",
         currencyTotals: revenueByCurrency,
      },
      {
         title: "Registrados sin pago",
         value: (totalRegistrations - totalPaidRegistrations).toLocaleString(),
         icon: Calendar,
         color: "bg-orange-50 text-orange-600",
         bgColor: "bg-orange-500",
      },
   ] as StatItem[];

   interface BaseStat {
      title: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
      bgColor: string;
      subtitle?: string;
   }

   interface ValueStat extends BaseStat {
      value: string;
   }

   interface CurrencyTotalsStat extends BaseStat {
      currencyTotals: Record<string, number>;
   }

   interface PaymentBreakdownStat extends BaseStat {
      paymentBreakdown: Record<string, number>;
   }

   type StatItem = ValueStat | CurrencyTotalsStat | PaymentBreakdownStat;

   return (
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
         {stats.map((stat, index) => (
            <div
               key={index}
               className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl"
            >
               <div className="flex justify-between items-center">
                  <div className="min-w-0">
                     <p className="font-medium text-gray-600 text-sm">
                        {stat.title}
                     </p>
                     {/* Default single value */}
                     {"value" in stat && (
                        <p className="mt-2 font-bold text-gray-900 text-3xl truncate">
                           {stat.value}
                        </p>
                     )}
                     {/* Currency-separated totals */}
                     {"currencyTotals" in stat && (
                        <div className="space-y-1 mt-2">
                           {Object.keys(stat.currencyTotals)
                              .sort()
                              .map((cur) => (
                                 <div
                                    key={cur}
                                    className="flex justify-between items-center gap-3"
                                 >
                                    <span className="bg-purple-100 px-2 py-0.5 rounded font-medium text-purple-700 text-xs">
                                       {cur === "sin-moneda"
                                          ? "Sin moneda"
                                          : cur.toUpperCase()}
                                    </span>
                                    <span className="font-semibold text-gray-900 text-lg">
                                       {formatMoney(
                                          stat.currencyTotals[cur],
                                          cur,
                                       )}
                                    </span>
                                 </div>
                              ))}
                           {Object.keys(stat.currencyTotals).length === 0 && (
                              <p className="font-bold text-gray-900 text-3xl">
                                 $0.00
                              </p>
                           )}
                        </div>
                     )}
                     {/* Payment breakdown */}
                     {"paymentBreakdown" in stat && (
                        <div className="space-y-1 mt-2">
                           {Object.keys(stat.paymentBreakdown).map((key) => (
                              <div
                                 key={key}
                                 className="flex justify-between items-center gap-3"
                              >
                                 <span className="bg-green-100 px-2 py-0.5 rounded font-medium text-green-700 text-xs">
                                    {key}
                                 </span>
                                 <span className="font-semibold text-gray-900 text-lg">
                                    {stat.paymentBreakdown[
                                       key
                                    ].toLocaleString()}
                                 </span>
                              </div>
                           ))}
                        </div>
                     )}
                     {stat.subtitle && (
                        <p className="mt-1 text-gray-500 text-sm">
                           {stat.subtitle}
                        </p>
                     )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
