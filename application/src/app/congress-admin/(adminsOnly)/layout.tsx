import { redirect } from "next/navigation";
import GoBackButton from "@/components/global/GoBackButton";
import { checkAuthorizedUserFromServer } from "@/services/authServices";

export default async function CongressAdminLayout({ children }: { children: React.ReactNode }) {
   const isUserAuthorized = await checkAuthorizedUserFromServer(["super_admin", "admin"]);
   if (!isUserAuthorized) {
      redirect("/login");
   }

   return (
      <div className="mx-auto px-4 py-4 border border-x max-w-screen-xl min-h-screen">
         <GoBackButton backButtonText="Volver al panel de administración" backURL="/congress-admin" className="mb-4" />
         {children}
      </div>
   );
}
