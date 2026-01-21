import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { CertificateDesign, CongressCertificate } from "../types/certificatesTypes";

export async function getCertificateDesign({
   congressId,
   certificateType,
}: {
   congressId: CongressRecord["id"];
   certificateType: CongressCertificate["certificateType"];
}) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      certificateType = {:certificateType}
   `,
      {
         organizationId: organization.id,
         congressId,
         certificateType,
      },
   );

   const certificateDesign = await getSingleDBRecord<CertificateDesign>("CONGRESS_CERTIFICATE_DESIGNS", filter);

   return certificateDesign;
}
