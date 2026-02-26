import { headers } from "next/headers";
import { redirect } from "next/navigation";
import GoBackButton from "@/components/global/GoBackButton";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function CongressAdminLayout({ children }: { children: React.ReactNode }) {
   const headersList = await headers();
   const currentPath = headersList.get("x-current-path") ?? "/congress-admin";

   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user) {
      return redirect(`/login?redirectTo=${currentPath}`);
   }

   if (user.role !== "super_admin" && user.role !== "admin") {
      return redirect(`/unauthorized?route=${currentPath}`);
   }

   return (
      <div className="mx-auto px-4 py-4 border border-x max-w-7xl min-h-dvh">
         <GoBackButton backButtonText="Volver al panel de administración" backURL="/congress-admin" className="mb-4" />
         {children}
      </div>
   );
}
