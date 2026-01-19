import { AlertCircle, CreditCard, TrendingUp } from "lucide-react";
import { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";

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
   const successfulPayments = payments.filter(
      (payment) => payment.fulfilledSuccessfully,
   );
   const failedPayments = payments.filter(
      (payment) => !payment.fulfilledSuccessfully,
   );

   const avgPaymentAmount =
      successfulPayments.length > 0
         ? successfulPayments.reduce(
              (sum, payment) => sum + (payment.totalAmount || 0),
              0,
           ) /
           successfulPayments.length /
           100
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

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">
               Métricas de Pagos
            </h2>
            <p className="mt-1 text-gray-600">
               Análisis detallado de transacciones
            </p>
         </div>

         <div className="p-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
               {/* Average Payment */}
               <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                     <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">
                        Pago Promedio
                     </p>
                     <p className="font-bold text-gray-900 text-2xl">
                        ${avgPaymentAmount.toFixed(2)}
                     </p>
                  </div>
               </div>

               {/* Payment Method */}
               <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                     <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">
                        Método Más Usado
                     </p>
                     <p className="font-bold text-gray-900 text-lg">
                        {mostUsedMethod[0]}
                     </p>
                     <p className="text-gray-500 text-sm">
                        {mostUsedMethod[1]} usos
                     </p>
                  </div>
               </div>

               {/* Failed Payments */}
               <div className="flex items-center space-x-4 bg-red-50 p-4 rounded-lg">
                  <div className="bg-red-100 p-2 rounded-lg">
                     <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                     <p className="font-medium text-gray-600 text-sm">
                        Pagos Fallidos
                     </p>
                     <p className="font-bold text-gray-900 text-2xl">
                        {failedPayments.length}
                     </p>
                     <p className="text-gray-500 text-sm">
                        {payments.length > 0
                           ? Math.round(
                                (failedPayments.length / payments.length) * 100,
                             )
                           : 0}
                        % del total
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
