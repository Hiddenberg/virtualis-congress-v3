import CertificateComponent from "@/features/certificates/components/CertificateComponent";

export default function AdjustCertificatesPage() {
   return (
      <div>
         <h1>Ajusta los certificados</h1>

         <div className="flex flex-wrap gap-4">
            <CertificateComponent
               certificateDesign={{
                  certificateType: "speaker",
                  backgroundURL:
                     "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506500/7008cfcc-eaab-4a55-ba80-4d8244f2cd02.png",
                  nameXPosition: 0.5,
                  nameYPosition: 0.5,
                  nameColor: "#000000",
                  nameFontSizeMultiplier: 1,
                  organization: "1",
                  congress: "1",
               }}
               displayName="Juan Perez"
            />
         </div>
      </div>
   );
}
