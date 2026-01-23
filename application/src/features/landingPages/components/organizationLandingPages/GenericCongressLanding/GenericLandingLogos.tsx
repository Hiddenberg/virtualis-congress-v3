import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

function LogoItem({ logoURL, alt, className }: { logoURL: string; alt: string; className: string }) {
   return <img src={logoURL} alt={alt} className={`bg-white p-1 rounded-lg w-auto h-full object-contain ${className}`} />;
}

export default function GenericLandingLogos({
   organization,
   additionalLogosURLs,
}: {
   organization: OrganizationRecord;
   additionalLogosURLs?: string[];
}) {
   return (
      <div className="flex flex-wrap items-center gap-2 md:*:h-18 lg:*:h-22 *:h-13">
         {organization.logoURL && (
            <LogoItem
               logoURL={organization.logoURL}
               alt={`${organization.name} logo`}
               className="bg-white p-2 rounded-lg w-auto h-full object-contain"
            />
         )}
         {additionalLogosURLs?.map((logoURL) => (
            <LogoItem
               key={logoURL}
               logoURL={logoURL}
               alt={`additional logo`}
               className="bg-white p-2 rounded-lg w-auto h-full object-contain"
            />
         ))}
      </div>
   );
}
