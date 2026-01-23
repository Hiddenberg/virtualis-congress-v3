import { getOrganizationFromSubdomain } from "../services/organizationServices";
import { OrganizationContextProvider } from "./OrganizationContext";

export default async function ServerOrganizationContextProvider({ children }: { children: React.ReactNode }) {
   const organization = await getOrganizationFromSubdomain();

   return <OrganizationContextProvider organization={organization}>{children}</OrganizationContextProvider>;
}
