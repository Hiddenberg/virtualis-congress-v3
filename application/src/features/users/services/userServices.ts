import "server-only";

import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import type { RoleType, User } from "../types/userTypes";
import { getUserRole } from "./userRoleServices";

export interface NewUserData {
   name: string;
   email: string;
   role: RoleType;
   dateOfBirth?: string;
   phoneNumber?: string;
   additionalEmail1?: string;
   additionalEmail2?: string;
}
export async function createUser(userData: NewUserData) {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }

   const normalizedEmail = userData.email.toLowerCase().trim();
   const normalizedAdditionalEmail1 = userData.additionalEmail1?.toLowerCase().trim();
   const normalizedAdditionalEmail2 = userData.additionalEmail2?.toLowerCase().trim();

   const newUser = await createDBRecord<User>("USERS", {
      organization: organization.id,
      name: userData.name,
      email: normalizedEmail,
      role: userData.role,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      additionalEmail1: normalizedAdditionalEmail1,
      additionalEmail2: normalizedAdditionalEmail2,
   });

   return newUser;
}

/**
 * Checks if the user has any of the roles allowed to access the resource
 * @param userId
 * @param rolesAllowed
 * @returns
 */
export async function checkUserAuthorization(userId: string, rolesAllowed: RoleType[]) {
   if (rolesAllowed.length === 0) {
      throw new Error("No roles provided");
   }

   const userRole = await getUserRole(userId);

   if (userRole && rolesAllowed.includes(userRole.role)) {
      return true;
   }

   return false;
}

export async function getUserByEmail(email: string) {
   const organization = await getOrganizationFromSubdomain();

   const normalizedEmail = email.toLowerCase().trim();

   const filter = pbFilter(
      `
         organization = {:organizationId} &&
         email:lower = {:normalizedEmail}
      `,
      {
         organizationId: organization.id,
         normalizedEmail,
      },
   );
   const userRecord = await getSingleDBRecord<User>("USERS", filter);

   return userRecord;
}

export async function getUserById(userId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter("id = {:userId} && organization = {:organizationId}", {
      userId,
      organizationId: organization.id,
   });
   const userRecord = await getSingleDBRecord<User>("USERS", filter);

   return userRecord;
}

export async function getAllOrganizationUsers() {
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[getAllUsers] Organization not found");
   }

   const filter = pbFilter("organization__user_roles_via_user.organization ?= {:organizationId}", {
      organizationId: organization.id,
   });
   const users = await getFullDBRecordsList<User>("USERS", {
      filter,
   });
   return users;
}

export async function checkIfUserExists(email: string) {
   const organization = await getOrganizationFromSubdomain();
   const normalizedEmail = email.toLowerCase().trim();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      email:lower = {:normalizedEmail}
      `,
      {
         organizationId: organization.id,
         normalizedEmail,
      },
   );

   const existingUser = await getSingleDBRecord<User>("USERS", filter);

   return existingUser !== null;
}

export async function deleteUser(userId: string) {
   await deleteDBRecord("USERS", userId);
}

export async function updateUser(userId: string, newUserData: Partial<User>) {
   const userUpdated = await updateDBRecord<User>("USERS", userId, newUserData);
   return userUpdated;
}
