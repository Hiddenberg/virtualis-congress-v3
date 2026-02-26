import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function CompleteRegistrationFlowLayout({ children }: { children: React.ReactNode }) {
   const headersList = await headers();
   const currentPath = headersList.get("x-current-path") ?? "/lobby";
   const user = await getLoggedInUserId();

   if (!user) {
      return redirect(`/login?redirectTo=${currentPath}`);
   }

   return <div>{children}</div>;
}
