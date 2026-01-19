import SponsorCarousel from "@/components/conference-zone/SponsorCarousel";
import MainHeader from "@/components/global/MainHeader";
import { getExpandedConferenceById } from "@/features/conferences/services/conferenceServices";
import OrganizationSpecificComponent from "@/features/organizations/components/OrganizationSpecificComponent";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
// import SponsorCarousel from "@/components/conference-zone/SponsorCarousel"

export default async function AttendantConferenceLayout({
   params,
   children,
}: {
   params: Promise<{ conferenceId: string }>;
   children: React.ReactNode;
}) {
   const { conferenceId } = await params;
   const conference = await getExpandedConferenceById(conferenceId);

   if (!conference) {
      return (
         <div className="mx-auto p-3 sm:p-6 container">
            <h1 className="mb-4 sm:mb-6 font-bold text-xl sm:text-2xl">
               Conferencia no encontrada
            </h1>
            <p className="text-sm sm:text-base">
               La conferencia con ID {conferenceId} no existe o no está
               disponible.
            </p>
         </div>
      );
   }

   const organization = await getOrganizationFromSubdomain();
   const organizationIsCMIM = organization.shortID === "CMIMCC";
   const backgroundImage = organizationIsCMIM
      ? "bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center bg-fixed"
      : "";

   return (
      <div className="mx-auto container">
         <div className="flex lg:flex-row flex-col">
            <div className={`w-full ${backgroundImage}`}>
               <div>
                  <MainHeader />
               </div>
               {children}
               {/* <div className="md:hidden block">
                  <MainHeader />
               </div> */}
               {/* <ViewsAndLikesSection /> */}

               <OrganizationSpecificComponent organizationShortID="ACP-MX">
                  <div className="px-2 md:px-4">
                     <SponsorCarousel
                        title="Nuestros Colaboradores"
                        sponsors={[
                           {
                              name: "ACP México",
                              logoURL:
                                 "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png",
                              background: "light",
                           },
                           {
                              name: "CMIM",
                              logoURL:
                                 "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1763051920/cmim_logo_k0wgl9.webp",
                              background: "light",
                           },
                           {
                              name: "CMIM2",
                              logoURL:
                                 "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1763093392/cmimlogo2_rjxuhr.webp",
                              background: "light",
                           },
                           {
                              name: "Expertos en síndrome metabólico",
                              logoURL:
                                 "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1763051919/expertos_SM_logo_uhao2h.webp",
                              background: "light",
                           },
                        ]}
                        sponsorsPerPage={1}
                     />
                  </div>
               </OrganizationSpecificComponent>
            </div>
         </div>
      </div>
   );
}
