import { redirect } from "next/navigation";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkUserAuthorization } from "@/features/users/services/userServices";

export default async function RecordingsRestrictedAccessLayout({ children }: { children: React.ReactNode }) {
   const userId = await getLoggedInUserId();

   if (!userId) {
      return redirect("/login/?redirectTo=/recordings");
   }

   const isUserAuthorized = await checkUserAuthorization(userId, ["super_admin", "admin", "coordinator"]);

   if (!isUserAuthorized) {
      return redirect("/unauthorized?route=/recordings");
   }

   return children;
}
