import { redirect } from "next/navigation";
import CongressLocationCard from "@/components/payment-page/modalitySelection/CongressLocationCard";
import ModalitySelectionGrid from "@/components/payment-page/modalitySelection/ModalitySelectionGrid";
import ModalitySelectionHeader from "@/components/payment-page/modalitySelection/ModalitySelectionHeader";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function PaymentPage() {
   const userId = await getLoggedInUserId();
   const [congress, paymentConfirmed] = await Promise.all([getLatestCongress(), confirmUserCongressPayment(userId ?? "")]);

   if (!congress) {
      throw new Error("Congress not found");
   }

   if (paymentConfirmed) {
      redirect("/payment/confirmed");
   }

   if (congress.modality === "online") {
      redirect("/payment/prices/online");
   }

   return (
      <div className="relative bg-linear-to-br from-gray-50 via-white to-gray-50 min-h-dvh">
         {/* Background decoration */}
         <div className="z-10 relative mx-auto p-4 sm:p-6 md:p-8 max-w-5xl min-h-dvh">
            <ModalitySelectionHeader />

            {congress.congressLocation && <CongressLocationCard location={congress.congressLocation} />}

            <ModalitySelectionGrid />
         </div>
      </div>
   );
}
