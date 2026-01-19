import MainHeader from "@/components/global/MainHeader";
import { getExpandedConferenceById } from "@/features/conferences/services/conferenceServices";
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
               <div className="hidden md:block">
                  <MainHeader />
               </div>
               {children}
               <div className="md:hidden block">
                  <MainHeader />
               </div>
               {/* <ViewsAndLikesSection /> */}
               {/* <SponsorCarousel /> */}
            </div>
         </div>
      </div>
   );
}
