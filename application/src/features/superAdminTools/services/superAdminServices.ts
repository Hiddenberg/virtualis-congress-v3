import { getAllCongressRegistrationsWithUsers } from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getAllOrganizationCompletedPayments } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";

export async function getAllUsersWithoutPayments() {
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("Congress not found");
   }

   const allCongressRegistrations =
      await getAllCongressRegistrationsWithUsers();
   const allCompletedPayments = await getAllOrganizationCompletedPayments();

   const usersWithoutPayments = allCongressRegistrations.filter(
      (registration) =>
         !allCompletedPayments.some(
            (payment) => payment.user === registration.user,
         ),
   );

   return usersWithoutPayments.map((registration) => registration.expand.user);
}
