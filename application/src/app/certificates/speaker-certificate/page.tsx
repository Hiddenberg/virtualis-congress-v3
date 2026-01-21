import CertificatesListSection from "@/features/certificates/components/CertificatesListSection";
import CreateSpeakerCertificateForm from "@/features/certificates/components/CreateSpeakerCertificateForm";
import { getCertificateDesign } from "@/features/certificates/services/certificateDesignServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function SpeakerCertificatePage() {
   const congress = await getLatestCongress();
   const speakerCertificateDesign = await getCertificateDesign({
      congressId: congress.id,
      certificateType: "speaker",
   });

   if (!speakerCertificateDesign) {
      return (
         <div>
            <h1>No se encontró el diseño del certificado</h1>
         </div>
      );
   }

   return (
      <div>
         <div className="mb-8">
            <h1 className="font-semibold text-gray-800 text-2xl">Tus certificados actuales</h1>

            <span className="mb-4 font-semibold text-red-600 text-sm">
               Nota: Tu nombre puede parecer descuadrado en la imagen de abajo.
               <br />
               En el Pdf cuando la descargues se verá correctamente.
            </span>
         </div>

         <CreateSpeakerCertificateForm speakerCertificateDesign={speakerCertificateDesign} />
         <CertificatesListSection />
      </div>
   );
}
