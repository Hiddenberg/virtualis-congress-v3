import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import "server-only";

export async function getUserRole(userId: string) {
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("Organization not found");
   }

   const filter = pbFilter("organization = {:organizationId} && id = {:userId}", {
      organizationId: organization.id,
      userId,
   });
   const userRole = await getSingleDBRecord<{ role: RoleType }>("USERS", filter, {
      fields: "role",
   });
   return userRole;
}

export async function updateUserRole(userId: string, role: RoleType) {
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("Organization not found");
   }

   const filter = pbFilter("organization = {:organizationId} && id = {:userId}", {
      organizationId: organization.id,
      userId,
   });
   const existingIuser = await getSingleDBRecord<User>("USERS", filter);
   if (!existingIuser) {
      throw new Error("User role not found");
   }

   const userUpdated = await updateDBRecord<User>("USERS", existingIuser.id, {
      role,
   });
   return userUpdated;
}
