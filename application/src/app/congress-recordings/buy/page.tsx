import { redirect } from "next/navigation";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { checkIfUserHasAccessToRecordings } from "@/features/organizationPayments/services/userPurchaseServices";
import BuyRecordingsCard from "@/features/recordings/components/BuyRecordingsCard";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function BuyRecordingsPage() {
   const userId = await getLoggedInUserId();
   if (!userId) {
      redirect("/login");
   }
   const congress = await getLatestCongress();
   const hasAccessToRecordings = await checkIfUserHasAccessToRecordings(userId, congress.id);

   if (hasAccessToRecordings) {
      redirect("/congress-recordings");
   }

   return (
      <div className="p-4 md:p-8">
         <div className="mb-6 text-center">
            <h1 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">Compra de grabaciones</h1>
            <p className="text-slate-600 text-base md:text-lg">Adquiere acceso a todas las grabaciones del congreso.</p>
         </div>
         <BuyRecordingsCard />
      </div>
   );
}
