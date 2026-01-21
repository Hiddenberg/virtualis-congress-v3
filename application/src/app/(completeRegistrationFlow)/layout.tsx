import { redirect } from "next/navigation";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function CompleteRegistrationFlowLayout({ children }: { children: React.ReactNode }) {
   const user = await getLoggedInUserId();

   if (!user) {
      return redirect("/login");
   }

   return <div>{children}</div>;
}
