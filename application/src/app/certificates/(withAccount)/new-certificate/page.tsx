import { redirect } from "next/navigation";
import CertificatesNameForm from "@/features/certificates/components/CertificatesNameForm";
import { getCongressCertificatesForUser } from "@/features/certificates/services/certificateServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function NewCertificate() {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user) {
      redirect("/login?redirectTo=/certificates");
   }

   const userCertificates = await getCongressCertificatesForUser(user.id);

   if (userCertificates && userCertificates.length > 0) {
      redirect("/certificates");
   }

   return (
      <div className="mx-auto max-w-3xl">
         <div className="mb-8">
            <h1 className="mt-4 font-semibold text-gray-800 text-3xl">
               Configura tu nombre en certificados
            </h1>
            <p className="mt-2 text-gray-600">
               Personaliza cómo aparecerá tu nombre en todos los certificados
               que obtengas.
            </p>
         </div>

         <CertificatesNameForm />
      </div>
   );
}
