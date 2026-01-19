import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import ACPDiabetesDataForm from "./ACPDiabetesDataForm";
import CMIMCCAttendantDataForm from "./CMIMCCAttendantDataForm";

export default async function AttendantDataFormSelector() {
   const organization = await getOrganizationFromSubdomain();

   const formsMap: Record<OrganizationRecord["shortID"], React.ReactNode> = {
      CMIMCC: <CMIMCCAttendantDataForm />,
      "ACP-MX": <ACPDiabetesDataForm />,
   };

   const form = formsMap[organization.shortID];

   if (!form) {
      return <div>No form found</div>;
   }

   return form;
}
