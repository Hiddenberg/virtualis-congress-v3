import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";
import { GlobalPopUpProvider } from "@/features/globalPopUp/context/GlobalPopUpContext";
import { OrganizationContextProvider } from "@/features/organizations/context/OrganizationContext";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { StaggeredAuthContextProvider } from "@/features/staggeredAuth/context/StaggeredAuthContext";

export async function generateMetadata(): Promise<Metadata> {
   const organization = await getOrganizationFromSubdomain();

   const metadataMap: Record<string, Metadata> = {
      CMIMCC: {
         title: "Virtualis Congress | CMIM Costa Chiapas | Congreso Anual de Medicina Interna",
         description: "XXIX Congreso Anual de Medicina Interna Costa Chiapas",
      },
      "ACP-MX": {
         title: "Virtualis Congress | ACP México",
         description: "Master Class En Diabetes",
      },
   };

   const metadata = metadataMap[organization.shortID];

   if (!metadata) {
      return {
         title: "Virtualis Congress",
         description: "Virtualis Congress",
      };
   }

   return metadata;
}

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const organization = await getOrganizationFromSubdomain();

   return (
      <html lang="es-MX">
         <body>
            <ReactQueryProvider>
               <Toaster />
               <StaggeredAuthContextProvider>
                  <OrganizationContextProvider organization={organization}>
                     <GlobalPopUpProvider>
                        <div className="mx-auto w-full max-w-[1440px] min-h-dvh">
                           {children}
                        </div>
                     </GlobalPopUpProvider>
                  </OrganizationContextProvider>
               </StaggeredAuthContextProvider>
            </ReactQueryProvider>
         </body>
      </html>
   );
}
