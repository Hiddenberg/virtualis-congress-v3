"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ClientResponseError } from "pocketbase";
import { updateUserRole } from "@/features/users/services/userRoleServices";
import {
   createUser,
   deleteUser,
   getAllOrganizationUsers,
   getUserByEmail,
   getUserById,
   type NewUserData,
   updateUser,
} from "@/features/users/services/userServices";

export async function getUserByIdAction(userId: string) {
   try {
      const user = await getUserById(userId);
      return {
         user,
         error: null,
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            user: null,
            error: error.message,
         };
      }
      throw error;
   }
}
export async function createNewUserAction(
   newUserData: NewUserData,
): Promise<BackendResponse<{ userCreatedId: string }>> {
   try {
      const userCreatedId = await createUser(newUserData);
      return {
         success: true,
         data: {
            userCreatedId: userCreatedId.id,
         },
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      throw error;
   }
}

export async function getAllUsersAction() {
   try {
      const users = await getAllOrganizationUsers();
      return {
         users,
         error: null,
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            users: [],
            error: error.message,
         };
      }
      throw error;
   }
}

export async function updateUserAction(
   userId: string,
   userData: Partial<NewUserData>,
): Promise<BackendResponse<{ userUpdated: User }>> {
   try {
      const userUpdated = await updateUser(userId, userData);
      return {
         success: true,
         data: {
            userUpdated: userUpdated,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      throw error;
   }
}

export async function updateUserRoleAction(
   userId: string,
   role: RoleType,
): Promise<BackendResponse<{ userUpdated: User }>> {
   try {
      const userRoleUpdated = await updateUserRole(userId, role);
      return {
         success: true,
         data: {
            userUpdated: userRoleUpdated,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      throw error;
   }
}

export async function deleteUserAction(
   userId: string,
): Promise<BackendResponse<null>> {
   try {
      await deleteUser(userId);

      revalidatePath("/admin/users", "page");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      throw error;
   }
}
export async function setTokenCookieAction(token: string) {
   const cookieStore = await cookies();
   cookieStore.set("authToken", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31 * 2), // 2 months
      httpOnly: true,
   });
}

export async function removeTokenCookieAction() {
   const cookieStore = await cookies();
   cookieStore.delete("authToken");
}

export async function checkExistingEmailAction(
   email: string,
): Promise<BackendResponse<{ existingUser: boolean }>> {
   try {
      const user = await getUserByEmail(email);
      return {
         success: true,
         data: {
            existingUser: user !== null,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      throw error;
   }
}
