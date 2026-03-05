"use server";

import { revalidatePath } from "next/cache";
import {
   getCongressRegistrationByUserId,
   registerUserToLatestCongress,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { sendSpeakerRegistrationConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type { NewUserFormData } from "@/features/staggeredAuth/components/signup/StaggeredAuthSignupForm";
import {
   createUserAuthData,
   setAuthTokenCookie,
   setRefreshTokenCookie,
} from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import type { SpeakerDataRecord } from "@/types/congress";
import { updateUserRole } from "../../services/userRoleServices";
import { checkIfUserExists, createUser, getUserByEmail } from "../../services/userServices";
import type { UserRecord } from "../../types/userTypes";
import {
   createSpeakerDataRecord,
   getSpeakerById,
   getSpeakerDataByUserId,
   linkSpeakerAccount,
   type NewSpeakerData,
   type UpdateSpeakerDataInput,
   unlinkSpeakerAccount,
   updateSpeakerDataRecord,
} from "../services/speakerServices";

export async function registerSpeakerFromAdminFormAction(
   speakerRegistrationInfo: NewSpeakerData,
): Promise<BackendResponse<SpeakerDataRecord>> {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer(["admin", "super_admin"]);

      if (!isUserAuthorized) {
         return {
            success: false,
            errorMessage: "No tienes permisos para registrar un nuevo usuario",
         };
      }

      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();

      let userId: string | undefined;
      if (speakerRegistrationInfo.email) {
         const newUser = await createUser({
            name: speakerRegistrationInfo.name,
            email: speakerRegistrationInfo.email,
            phoneNumber: speakerRegistrationInfo.phoneNumber,
            role: "speaker",
         });
         await registerUserToLatestCongress(newUser.id); // Register user to latest congress
         userId = newUser.id;
      }

      const newSpeakerData = await createSpeakerDataRecord({
         speakerRegistrationInfo,
         organizationId: organization.id,
         congressId: congress.id,
         userId,
      });
      revalidatePath("/congress-admin/speakers");
      return {
         success: true,
         data: newSpeakerData,
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
         errorMessage: "Error al registrar el ponente",
      };
   }
}

export async function registerSpeakerUserAction(
   newUserData: NewUserFormData,
   conferenceSpeakerData: SpeakerDataRecord,
): Promise<BackendResponse<{ successMessage: string }>> {
   const userExists = await checkIfUserExists(newUserData.email);

   let userId: UserRecord["id"] | undefined;

   // If speaker data already has a user, return an error
   if (conferenceSpeakerData.user) {
      return {
         success: false,
         errorMessage: "Este ponente ya tiene una cuenta asociada, por favor inicia sesión con tu correo electrónico",
      };
   }

   // If user already exists, update their role to speaker
   if (userExists) {
      const user = await getUserByEmail(newUserData.email);

      if (!user) {
         return {
            success: false,
            errorMessage: "[registerSpeakerUserAction] Usuario no encontrado",
         };
      }

      // check if the account is already linked to a speaker
      const speakerData = await getSpeakerDataByUserId(user.id);
      if (speakerData) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado como ponente, por favor inicia sesión con este correo",
         };
      }

      // If user is not a speaker, update their role to speaker
      if (user.role === "attendant") {
         await updateUserRole(user.id, "speaker");
      }

      // If user is not registered to the latest congress, register them
      const userRegistration = await getCongressRegistrationByUserId(user.id);
      if (!userRegistration) {
         await registerUserToLatestCongress(user.id);
      }

      userId = user.id;
   } else {
      // If user does not exist, create a new user with speaker role
      const newUser = await createUser({
         ...newUserData,
         role: "speaker",
      });

      await registerUserToLatestCongress(newUser.id);

      userId = newUser.id;
   }

   await linkSpeakerAccount(userId, conferenceSpeakerData.id);
   await sendSpeakerRegistrationConfirmationEmail(userId);

   // Set auth token and refresh token cookies
   const authData = await createUserAuthData(userId);
   await setRefreshTokenCookie(authData.refreshToken);
   await setAuthTokenCookie(authData.authToken);

   return {
      success: true,
      data: {
         successMessage: "Conferencista registrado correctamente",
      },
   };
}

export interface UpdateSpeakerFormData extends UpdateSpeakerDataInput {
   speakerId: string;
   linkEmail?: string;
   unlinkAccount?: boolean;
}

export async function updateSpeakerAction(formData: UpdateSpeakerFormData): Promise<BackendResponse<SpeakerDataRecord>> {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer(["admin", "super_admin"]);
      if (!isUserAuthorized) {
         return {
            success: false,
            errorMessage: "No tienes permisos para actualizar ponentes",
         };
      }

      const { speakerId, linkEmail, unlinkAccount, ...speakerData } = formData;

      if (unlinkAccount) {
         await unlinkSpeakerAccount(speakerId);
      } else if (linkEmail?.trim()) {
         const normalizedEmail = linkEmail.toLowerCase().trim();
         const userExists = await checkIfUserExists(normalizedEmail);

         if (!userExists) {
            return {
               success: false,
               errorMessage: "No existe un usuario con ese correo. Crea primero la cuenta del usuario.",
            };
         }

         const user = await getUserByEmail(normalizedEmail);
         if (!user) {
            return {
               success: false,
               errorMessage: "Usuario no encontrado",
            };
         }

         const existingSpeakerForUser = await getSpeakerDataByUserId(user.id);
         if (existingSpeakerForUser && existingSpeakerForUser.id !== speakerId) {
            return {
               success: false,
               errorMessage: "Este correo ya está vinculado a otro ponente",
            };
         }

         if (user.role === "attendant") {
            await updateUserRole(user.id, "speaker");
         }

         const userRegistration = await getCongressRegistrationByUserId(user.id);
         if (!userRegistration) {
            await registerUserToLatestCongress(user.id);
         }

         await linkSpeakerAccount(user.id, speakerId);
      }

      const updatePayload: UpdateSpeakerDataInput = {};
      if (speakerData.displayName !== undefined) updatePayload.displayName = speakerData.displayName;
      if (speakerData.academicTitle !== undefined) updatePayload.academicTitle = speakerData.academicTitle;
      if (speakerData.specialityDetails !== undefined) updatePayload.specialityDetails = speakerData.specialityDetails;
      if (speakerData.bio !== undefined) updatePayload.bio = speakerData.bio;
      if (speakerData.presentationPhoto !== undefined) updatePayload.presentationPhoto = speakerData.presentationPhoto;

      if (Object.keys(updatePayload).length > 0) {
         await updateSpeakerDataRecord(speakerId, updatePayload);
      }

      revalidatePath("/congress-admin/speakers");
      revalidatePath(`/congress-admin/speakers/${speakerId}/edit`);

      const updatedSpeaker = await getSpeakerById(speakerId);
      return {
         success: true,
         data: (updatedSpeaker ?? {}) as SpeakerDataRecord,
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
         errorMessage: "Error al actualizar el ponente",
      };
   }
}

export async function unlinkSpeakerAccountAction(speakerId: string): Promise<BackendResponse<{ success: boolean }>> {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer(["admin", "super_admin"]);
      if (!isUserAuthorized) {
         return {
            success: false,
            errorMessage: "No tienes permisos para desvincular cuentas",
         };
      }

      await unlinkSpeakerAccount(speakerId);
      revalidatePath("/congress-admin/speakers");
      revalidatePath(`/congress-admin/speakers/${speakerId}/edit`);

      return {
         success: true,
         data: { success: true },
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
         errorMessage: "Error al desvincular la cuenta",
      };
   }
}
