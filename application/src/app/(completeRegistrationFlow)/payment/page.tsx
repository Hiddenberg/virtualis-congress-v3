/* eslint-disable @next/next/no-img-element */

import { redirect } from "next/navigation";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function PaymentPage() {
   const userId = await getLoggedInUserId();
   const [organization, paymentConfirmed] = await Promise.all([
      getOrganizationFromSubdomain(),
      confirmUserCongressPayment(userId ?? ""),
   ]);

   if (paymentConfirmed) {
      redirect("/payment/confirmed");
   }

   return (
      <div>
         <h1>Payment Page</h1>
         <h2>Payment selection page not found for organization {organization.shortID}</h2>
      </div>
   );
}
