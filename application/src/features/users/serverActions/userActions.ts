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
   searchOrganizationUsers,
   updateUser,
} from "@/features/users/services/userServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import type { RoleType, User, UserRecord } from "../types/userTypes";

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
export async function createNewUserAction(newUserData: NewUserData): Promise<BackendResponse<{ userCreatedId: string }>> {
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

export async function searchOrganizationUsersAction(query: string): Promise<BackendResponse<{ users: UserRecord[] }>> {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer(["admin", "super_admin"]);
      if (!isUserAuthorized) {
         return {
            success: false,
            errorMessage: "No tienes permisos para buscar usuarios",
         };
      }

      const users = await searchOrganizationUsers(query);
      return {
         success: true,
         data: {
            users,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
   }
}

export interface AdminUserProfileFormData {
   userId: string;
   name: string;
   email: string;
   role: RoleType;
   phoneNumber?: string;
   dateOfBirth?: string;
   additionalEmail1?: string;
   additionalEmail2?: string;
}

export async function updateUserProfileAction(
   form: AdminUserProfileFormData,
): Promise<BackendResponse<{ userUpdated: UserRecord }>> {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer(["admin", "super_admin"]);
      if (!isUserAuthorized) {
         return {
            success: false,
            errorMessage: "No tienes permisos para actualizar usuarios",
         };
      }

      const existingUser = await getUserById(form.userId);
      if (!existingUser) {
         return {
            success: false,
            errorMessage: "Usuario no encontrado",
         };
      }

      if (existingUser.role === "super_admin") {
         return {
            success: false,
            errorMessage: "No se puede actualizar el perfil de un super admin",
         };
      }

      if (form.role === "super_admin") {
         return {
            success: false,
            errorMessage: "No puedes asignar el rol super admin desde esta pantalla",
         };
      }

      const normalizedEmail = form.email.toLowerCase().trim();
      const normalizedAdditionalEmail1 = form.additionalEmail1?.toLowerCase().trim();
      const normalizedAdditionalEmail2 = form.additionalEmail2?.toLowerCase().trim();

      const emailsToCheck = [normalizedEmail, normalizedAdditionalEmail1, normalizedAdditionalEmail2].filter(
         (email): email is string => Boolean(email),
      );

      const uniqueEmails = new Set(emailsToCheck);
      if (uniqueEmails.size !== emailsToCheck.length) {
         return {
            success: false,
            errorMessage: "Los correos no pueden repetirse entre sí",
         };
      }

      for (const email of emailsToCheck) {
         const userWithEmail = await getUserByEmail(email);
         if (userWithEmail && userWithEmail.id !== form.userId) {
            return {
               success: false,
               errorMessage: `El correo ${email} ya está registrado en la plataforma`,
            };
         }
      }

      const userUpdated = await updateUser(form.userId, {
         name: form.name.trim(),
         email: normalizedEmail,
         role: form.role,
         phoneNumber: form.phoneNumber?.trim() || undefined,
         dateOfBirth: form.dateOfBirth?.trim() || undefined,
         additionalEmail1: normalizedAdditionalEmail1 || undefined,
         additionalEmail2: normalizedAdditionalEmail2 || undefined,
      });

      revalidatePath("/congress-admin/users", "page");

      return {
         success: true,
         data: {
            userUpdated,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
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

export async function updateUserRoleAction(userId: string, role: RoleType): Promise<BackendResponse<{ userUpdated: User }>> {
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

export async function deleteUserAction(userId: string): Promise<BackendResponse<null>> {
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

export async function checkExistingEmailAction(email: string): Promise<BackendResponse<{ existingUser: boolean }>> {
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
