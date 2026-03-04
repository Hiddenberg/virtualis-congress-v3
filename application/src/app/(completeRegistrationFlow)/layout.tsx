import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { registerUserRegistrationAnalytics } from "@/features/analytics/registrationAnalytics/services/registrationAnalyticsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function CompleteRegistrationFlowLayout({ children }: { children: React.ReactNode }) {
   const headersList = await headers();
   const currentPath = headersList.get("x-current-path") ?? "/lobby";
   const user = await getLoggedInUserId();

   if (!user) {
      return redirect(`/login?redirectTo=${currentPath}`);
   }

   const congress = await getLatestCongress();
   // Register user registration analytics in the background
   if (user && congress) {
      registerUserRegistrationAnalytics({
         congressId: congress.id,
         userId: user,
      });
   }

   return <div>{children}</div>;
}
