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
import { getUserRole } from "./userRoleServices";

export interface NewUserData {
   name: string;
   email: string;
   role: RoleType;
   dateOfBirth?: string;
   phoneNumber?: string;
}
export async function createUser(userData: NewUserData) {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }

   const newUser = await createDBRecord<User>("USERS", {
      organization: organization.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
   });

   return newUser;
}

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

   const filter = pbFilter("email = {:email} && organization = {:organizationId}", {
      email,
      organizationId: organization.id,
   });
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
   const existingUser = await getUserByEmail(email);

   return existingUser !== null;
}

export async function deleteUser(userId: string) {
   await deleteDBRecord("USERS", userId);
}

export async function updateUser(userId: string, newUserData: Partial<User>) {
   const userUpdated = await updateDBRecord<User>("USERS", userId, newUserData);
   return userUpdated;
}

// STRIPE FUNCTIONS
// export async function getStripeCustomerId (userId: string) {
//    try {
//       const stripeCustomerData = await pbServerClient.collection(PB_COLLECTIONS.USERS_STRIPE_DATA)
//          .getFirstListItem<RecordModel & {stripeCustomerId: UserStripeData["stripeCustomerId"]}>(`user = "${userId}"`, {
//             fields: "stripeCustomerId"
//          })

//       return stripeCustomerData.stripeCustomerId
//    } catch (error) {
//       if (error instanceof ClientResponseError && error.status === 404) {
//          return null
//       }
//       throw error
//    }
// }

// export async function saveStripeCustomerId (user: User & RecordModel, stripeCustomerId: string) {
//    await pbServerClient.collection(PB_COLLECTIONS.USERS_STRIPE_DATA)
//       .create({
//          organization: user.organization,
//          user: user.id,
//          stripeCustomerId
//       }as UserStripeData)
// }

// export async function getUserByStripeCustomerId (stripeCustomerId: string) {
//    try {
//       const response = await pbServerClient.collection(PB_COLLECTIONS.USERS_STRIPE_DATA)
//          .getFirstListItem<RecordModel & {expand: {user: User & RecordModel}}>(`stripeCustomerId = "${stripeCustomerId}"`,{
//             expand: "user",
//             fields: "expand.user"
//          })
//       return response.expand.user
//    } catch (error) {
//       if (error instanceof ClientResponseError && error.status === 404) {
//          return null
//       }
//       throw error
//    }
// }
