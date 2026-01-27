import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { User } from "../../types/userTypes";

export async function getAllCoordinatorUsers() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
      role = 'coordinator'
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const coordinatorUsers = await getFullDBRecordsList<User>("USERS", {
      filter,
   });

   return coordinatorUsers;
}
