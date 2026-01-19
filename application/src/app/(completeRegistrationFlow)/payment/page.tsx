/* eslint-disable @next/next/no-img-element */

import { redirect } from "next/navigation";
import CMIMCCPaymentSelectionForm from "@/features/organizationPayments/components/CMIMCCPaymentSelectionForm";
import HGEAPaymentForm from "@/features/organizationPayments/components/HGEAPaymentForm";
import { getCMIMCCStripeProducts } from "@/features/organizationPayments/services/CMIMCCPaymentServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import ACPDiabetesDataForm from "@/features/users/attendants/components/attendantDataForms/ACPDiabetesDataForm";
import type { CMIMCCMedicalRoleType } from "@/features/users/attendants/components/attendantDataForms/CMIMCCAttendantDataForm";
import { getAttendantData } from "@/features/users/attendants/services/attendantServices";
import type { CMIMCCAdditionalAttendantData } from "@/features/users/attendants/types/CMIMCCAdditionalAttendantDataTypes";

export default async function PaymentPage() {
   const userId = await getLoggedInUserId();
   const [
      organization,
      userAttendantAdditionalData,
      paymentConfirmed,
      CMIMCCStripeProducts,
   ] = await Promise.all([
      getOrganizationFromSubdomain(),
      getAttendantData(userId ?? ""),
      confirmUserCongressPayment(userId ?? ""),
      getCMIMCCStripeProducts(),
   ]);

   if (paymentConfirmed) {
      redirect("/payment/confirmed");
   }

   if (organization.shortID === "CMIMCC") {
      if (!userAttendantAdditionalData) {
         return redirect("/registration-confirmed");
      }

      const CMIMCCAdditionalData =
         userAttendantAdditionalData.additionalData as unknown as CMIMCCAdditionalAttendantData;
      const userMedicalRole = CMIMCCAdditionalData.medicalRole;

      const medicalRolesMap: Record<CMIMCCMedicalRoleType, string> = {
         specialist: "Médico Especialista",
         general: "Médico General",
         health_professional: "Profesional de la Salud",
         "student/resident": "Estudiante / Residente",
      };

      const categoryPricesMap: Record<CMIMCCMedicalRoleType, number> = {
         specialist:
            CMIMCCStripeProducts["XXIX-Congress-In-Person"].prices.regular
               .price,
         general:
            CMIMCCStripeProducts["XXIX-Congress-In-Person"].prices[
               "general-medics"
            ].price,
         health_professional:
            CMIMCCStripeProducts["XXIX-Congress-In-Person"].prices[
               "health-professionals"
            ].price,
         "student/resident":
            CMIMCCStripeProducts["XXIX-Congress-In-Person"].prices[
               "students/residents"
            ].price,
      };

      return (
         <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 min-h-screen">
            <div className="mx-auto px-2 sm:px-4 max-w-4xl container">
               {/* Header */}
               <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                  <h1 className="mb-2 sm:mb-3 md:mb-4 px-2 font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
                     Finalizar Inscripción
                  </h1>
                  <p className="mx-auto px-2 max-w-2xl text-gray-600 text-base sm:text-lg leading-relaxed">
                     Selecciona tu modalidad de participación y completa tu pago
                     para asegurar tu lugar en el congreso
                  </p>
               </div>

               <CMIMCCPaymentSelectionForm
                  userCategory={medicalRolesMap[userMedicalRole]}
                  isInternational={false}
                  userCategoryPrice={categoryPricesMap[userMedicalRole]}
               />
            </div>
         </div>
      );
   }

   if (organization.shortID === "HGEA") {
      return (
         <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 min-h-screen">
            <div className="mx-auto px-2 sm:px-4 max-w-3xl container">
               <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                  <h1 className="mb-2 sm:mb-3 md:mb-4 px-2 font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
                     Finalizar inscripción
                  </h1>
                  <p className="mx-auto px-2 max-w-2xl text-gray-600 text-base sm:text-lg">
                     Tu acceso es en línea e incluye grabaciones. Solo da clic
                     para proceder al pago.
                  </p>
               </div>
               <HGEAPaymentForm />
            </div>
         </div>
      );
   }

   if (organization.shortID === "ACP-MX") {
      return (
         <div className="pt-4 sm:pt-6 md:pt-8">
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               {organization.logoURL && (
                  <img
                     src={organization.logoURL}
                     alt={organization.name}
                     className="mx-auto mb-2 sm:mb-3 md:mb-4 px-2 w-auto h-12 sm:h-14 md:h-16 object-contain"
                  />
               )}
               <h1 className="mb-2 sm:mb-3 md:mb-4 px-2 font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
                  Completa tu inscripción
               </h1>
            </div>
            <ACPDiabetesDataForm />
         </div>
      );
   }

   return (
      <div>
         <h1>Payment Page</h1>
         <h2>
            Payment selection page not found for organization{" "}
            {organization.shortID}
         </h2>
      </div>
   );
}
