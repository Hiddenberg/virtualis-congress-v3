import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import DynamicMarker from "@/components/global/DynamicMarker";
import GlobalLoadingPage from "@/components/global/GlobalLoadingPage";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";
import { GlobalPopUpProvider } from "@/features/globalPopUp/context/GlobalPopUpContext";
import ServerOrganizationContextProvider from "@/features/organizations/context/ServerOrganizationContextProvider";
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
   return (
      <html lang="es-MX">
         <body>
            <DynamicMarker />
            <ReactQueryProvider>
               <Toaster />
               <Suspense fallback={<GlobalLoadingPage />}>
                  <StaggeredAuthContextProvider>
                     <ServerOrganizationContextProvider>
                        <GlobalPopUpProvider>
                           <div className="mx-auto w-full max-w-[1440px] min-h-dvh">{children}</div>
                        </GlobalPopUpProvider>
                     </ServerOrganizationContextProvider>
                  </StaggeredAuthContextProvider>
               </Suspense>
            </ReactQueryProvider>
         </body>
      </html>
   );
}
