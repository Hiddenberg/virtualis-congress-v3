import { redirect } from "next/navigation";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function ManualRegistrationLayout({ children }: { children: React.ReactNode }) {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");

   if (!user) {
      return redirect("/login?redirectTo=/manual-registration");
   }

   if (user.role !== "admin" && user.role !== "super_admin") {
      return redirect("/");
   }

   return children;
}
