// import CertificatesListSection from "@/components/certificates/CertificatesListSection"

import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import CertificateComponent from "@/features/certificates/components/CertificateComponent";
import CertificatesListSection from "@/features/certificates/components/CertificatesListSection";
import { getCertificateDesign } from "@/features/certificates/services/certificateDesignServices";
import { getCongressCertificatesForUser } from "@/features/certificates/services/certificateServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function CertificatesPage() {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user) {
      redirect("/login?redirectTo=/certificates");
   }

   const congressCertificates = await getCongressCertificatesForUser(user.id);

   if (!congressCertificates || congressCertificates.length === 0) {
      redirect("/certificates/new-certificate");
   }

   const congress = await getLatestCongress();
   const attenddantCertificateDesign = await getCertificateDesign({
      congressId: congress.id,
      certificateType: "attendee",
   });

   if (!attenddantCertificateDesign) {
      return (
         <div>
            <h1 className="mb-4 font-semibold text-gray-800 text-xl">
               No se encontró el diseño del certificado
            </h1>
            <LinkButton href="/lobby" variant="blue">
               Volver al lobby
            </LinkButton>
         </div>
      );
   }

   return (
      <div>
         <div className="mb-8">
            <h1 className="font-semibold text-gray-800 text-2xl">
               Tus certificados actuales
            </h1>

            <span className="mb-4 font-semibold text-red-600 text-sm">
               Nota: Tu nombre puede parecer descuadrado en la imagen de abajo.
               <br />
               En el Pdf cuando la descargues se verá correctamente.
            </span>
         </div>

         <div className="flex flex-wrap gap-4">
            {congressCertificates.map((certificate) => (
               <CertificateComponent
                  key={certificate.id}
                  certificateDesign={attenddantCertificateDesign}
                  displayName={certificate.userDisplayName}
               />
            ))}
         </div>
         <CertificatesListSection />
      </div>
   );
}
