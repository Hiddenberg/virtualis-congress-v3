import { AlertCircle, CreditCard, TrendingUp } from "lucide-react";
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

interface PaymentMetricsGridProps {
   registrations: CongressRegistrationRecord[];
   payments: UserPaymentRecord[];
}

export default function PaymentMetricsGrid({
   // registrations,
   payments,
}: PaymentMetricsGridProps) {
   const isCashPayment = (payment: UserPaymentRecord) => (payment.paymentMethod ?? "").toLowerCase() === "cash";
   const manualPayments = payments.filter(isCashPayment);
   const stripePayments = payments.filter((payment) => !isCashPayment(payment));

   const successfulPayments = stripePayments.filter((payment) => payment.fulfilledSuccessfully);
   const failedPayments = stripePayments.filter((payment) => !payment.fulfilledSuccessfully);
   const successfulManualPayments = manualPayments.filter((payment) => payment.fulfilledSuccessfully);

   const avgPaymentAmount =
      successfulPayments.length > 0
         ? successfulPayments.reduce((sum, payment) => sum + (payment.totalAmount || 0), 0) / successfulPayments.length / 100
         : 0;

   const paymentMethods = successfulPayments.reduce(
      (acc, payment) => {
         const method = payment.paymentMethod || "No especificado";
         acc[method] = (acc[method] || 0) + 1;
         return acc;
      },
      {} as Record<string, number>,
   );

   const mostUsedMethod = Object.entries(paymentMethods).reduce(
      (a, b) => (paymentMethods[a[0]] > paymentMethods[b[0]] ? a : b),
      ["N/A", 0],
   );

   const manualTotalsByCurrency = successfulManualPayments.reduce(
      (acc, payment) => {
         const key = (payment.currency ?? "sin-moneda").toLowerCase();
         acc[key] = (acc[key] ?? 0) + (payment.totalAmount || 0);
         return acc;
      },
      {} as Record<string, number>,
   );

   const formatMoney = (amountCents: number, currencyKey: string) => {
      const amount = amountCents / 100;
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

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">Métricas de Pagos</h2>
            <p className="mt-1 text-gray-600">Análisis detallado de transacciones</p>
         </div>

         <div className="p-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
               {/* Average Payment */}
               <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                     <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">Pago Promedio</p>
                     <p className="font-bold text-gray-900 text-2xl">${avgPaymentAmount.toFixed(2)}</p>
                  </div>
               </div>

               {/* Payment Method */}
               <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                     <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">Método Más Usado</p>
                     <p className="font-bold text-gray-900 text-lg">{mostUsedMethod[0]}</p>
                     <p className="text-gray-500 text-sm">{mostUsedMethod[1]} usos</p>
                  </div>
               </div>

               {/* Manual Payments */}
               <div className="flex items-center space-x-4 bg-emerald-50 p-4 rounded-lg">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                     <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                     <p className="font-medium text-gray-600 text-sm">Pagos Registrados manualmente</p>
                     <p className="font-bold text-gray-900 text-2xl">{successfulManualPayments.length}</p>
                     <div className="space-y-1 mt-1">
                        {Object.keys(manualTotalsByCurrency)
                           .sort()
                           .map((cur) => (
                              <div key={cur} className="text-gray-500 text-sm">
                                 {cur === "sin-moneda" ? "Sin moneda" : cur.toUpperCase()}:{" "}
                                 {formatMoney(manualTotalsByCurrency[cur], cur)}
                              </div>
                           ))}
                        {Object.keys(manualTotalsByCurrency).length === 0 && <div className="text-gray-500 text-sm">$0.00</div>}
                     </div>
                  </div>
               </div>

               {/* Failed Payments */}
               <div className="flex items-center space-x-4 bg-red-50 p-4 rounded-lg">
                  <div className="bg-red-100 p-2 rounded-lg">
                     <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">Pagos Fallidos</p>
                     <p className="font-bold text-gray-900 text-2xl">{failedPayments.length}</p>
                     <p className="text-gray-500 text-sm">
                        {stripePayments.length > 0 ? Math.round((failedPayments.length / stripePayments.length) * 100) : 0}% del
                        total
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
