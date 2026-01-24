"use server";

import { cookies } from "next/headers";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import { sendOTPCodeEmail, sendPlatformRegistrationConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getUserRole } from "@/features/users/services/userRoleServices";
import {
   checkIfUserExists,
   createUser,
   getUserByEmail,
   getUserById,
   type NewUserData,
} from "@/features/users/services/userServices";
import { dbBatch } from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { AUTH_COOKIE_KEY, REFRESH_COOKIE_KEY } from "../constants/authConstants";
import {
   generateUserAuthToken,
   getUserIdFromAuthToken,
   getUserIdFromRefreshToken,
   verifyRefreshToken,
   verifyUserAuthToken,
} from "../services/jwtServices";
import { generateOTPCode } from "../services/otpServices";
import {
   authenticateWithBirthdate,
   authenticateWithOTPCode,
   authenticateWithPhoneNumber,
   createUserAuthData,
   setAuthTokenCookie,
   setRefreshTokenCookie,
} from "../services/staggeredAuthServices";
import { generateRandomId } from "../utils/passwordsGenerator";

export async function refreshAuthTokenAction() {
   const cookieStore = await cookies();
   const refreshToken = cookieStore.get(REFRESH_COOKIE_KEY)?.value;

   if (!refreshToken) {
      return {
         success: false,
         errorMessage: "No se encontró el token de refresco",
      };
   }

   const isRefreshTokenValid = await verifyRefreshToken(refreshToken);

   if (!isRefreshTokenValid) {
      return {
         success: false,
         errorMessage: "Token de refresco inválido",
      };
   }

   const userId = getUserIdFromRefreshToken(refreshToken);

   const newAuthToken = await generateUserAuthToken(userId);

   await setAuthTokenCookie(newAuthToken);

   return {
      success: true,
      data: null,
   };
}

export async function getUserAndRoleAction(): Promise<BackendResponse<{ authUser: UserRecord; userRole: RoleType }>> {
   const cookieStore = await cookies();
   const authToken = cookieStore.get(AUTH_COOKIE_KEY)?.value;
   if (!authToken) {
      return {
         success: false,
         errorMessage: "No se encontró el token de autenticación",
      };
   }

   const isValidAuthToken = verifyUserAuthToken(authToken);

   if (!isValidAuthToken) {
      return {
         success: false,
         errorMessage: "Token de autenticación inválido",
      };
   }

   const userId = getUserIdFromAuthToken(authToken);

   const authUser = await getUserById(userId);

   if (!authUser) {
      return {
         success: false,
         errorMessage: "Usuario no encontrado",
      };
   }

   const userRole = await getUserRole(userId);

   if (!userRole) {
      return {
         success: false,
         errorMessage: "Rol de usuario no encontrado",
      };
   }

   return {
      success: true,
      data: {
         authUser,
         userRole: userRole.role,
      },
   };
}

export async function checkExistingUserAction(email: string): Promise<BackendResponse<{ exists: boolean }>> {
   try {
      const exists = await checkIfUserExists(email);

      return {
         success: true,
         data: {
            exists,
         },
      };
   } catch (error) {
      console.error("[checkExistingUserAction] Error checking if user exists", error);
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al verificar si el usuario existe",
      };
   }
}

export async function requestOTPCodeAction(email: string): Promise<BackendResponse<{ successMessage: string }>> {
   try {
      const user = await getUserByEmail(email);

      if (!user) {
         return {
            success: false,
            errorMessage: "Este correo no está registrado por favor registrate para iniciar sesión",
         };
      }

      const otpCode = await generateOTPCode(user.id);
      await sendOTPCodeEmail(user.id, otpCode);

      return {
         success: true,
         data: {
            successMessage: "Código de verificación enviado correctamente",
         },
      };
   } catch (error) {
      console.error("[requestOTPCodeAction] Error generating OTP code", error);
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: `Ocurrió un error al generar el código de verificación: ${error.message}`,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al generar el código de verificación",
      };
   }
}

export async function authenticateWithOTPCodeAction(
   email: string,
   otpCode: string,
): Promise<BackendResponse<{ token: string; user: UserRecord; userRole: RoleType }>> {
   try {
      const authenticationResponse = await authenticateWithOTPCode(email, otpCode);

      await setRefreshTokenCookie(authenticationResponse.refreshToken);
      await setAuthTokenCookie(authenticationResponse.authToken);

      return {
         success: true,
         data: {
            token: authenticationResponse.authToken,
            user: authenticationResponse.authUser as User & DBRecord,
            userRole: authenticationResponse.userRole,
         },
      };
   } catch (error) {
      console.error("[authenticateWithOTPCodeAction] Error authenticating with OTP code", error);
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al iniciar sesión",
      };
   }
}

export async function authenticateWithBirthDateAction(
   email: string,
   birthDate: string,
): Promise<BackendResponse<{ token: string; user: UserRecord; userRole: RoleType }>> {
   try {
      const authData = await authenticateWithBirthdate(email, birthDate);

      await setRefreshTokenCookie(authData.refreshToken);
      await setAuthTokenCookie(authData.authToken);

      return {
         success: true,
         data: {
            token: authData.authToken,
            user: authData.authUser as User & DBRecord,
            userRole: authData.userRole,
         },
      };
   } catch (error) {
      console.error("[authenticateWithBirthDateAction] Error authenticating with birthday", error);
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al iniciar sesión",
      };
   }
}

export async function authenticateWithPhoneNumberAction(
   email: string,
   phoneNumber: string,
): Promise<BackendResponse<{ token: string; user: UserRecord; userRole: RoleType }>> {
   try {
      const authData = await authenticateWithPhoneNumber(email, phoneNumber);

      await setRefreshTokenCookie(authData.refreshToken);
      await setAuthTokenCookie(authData.authToken);

      return {
         success: true,
         data: {
            token: authData.authToken,
            user: authData.authUser as User & DBRecord,
            userRole: authData.userRole,
         },
      };
   } catch (error) {
      console.error("[authenticateWithPhoneNumberAction] Error authenticating with phone number", error);
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al iniciar sesión",
      };
   }
}

export async function signupAction(
   newUserData: Omit<NewUserData, "role">,
): Promise<BackendResponse<{ successMessage: string; user: UserRecord }>> {
   try {
      // Check existing users
      const existingAuthUser = await checkIfUserExists(newUserData.email);

      if (existingAuthUser) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado, por favor inicia sesión",
         };
      }

      const newUser = await createUser({
         ...newUserData,
         role: "attendant",
      });

      const authData = await createUserAuthData(newUser.id);
      await setRefreshTokenCookie(authData.refreshToken);
      await setAuthTokenCookie(authData.authToken);

      // Return success result
      return {
         success: true,
         data: {
            successMessage: "Usuario registrado correctamente",
            user: newUser,
         },
      };
   } catch (error) {
      console.error("[staggeredAuthAPI] Signup error:", error);
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al registrar el usuario",
      };
   }
}

export async function signupToCongressAction(newUserData: Omit<NewUserData, "role">): Promise<BackendResponse<null>> {
   try {
      // Check existing users
      const existingUser = await checkIfUserExists(newUserData.email);

      if (existingUser) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado, por favor inicia sesión",
         };
      }

      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();

      // In a transaction, create the user and register them to the congress, then send the registration confirmation email
      const newUserId = generateRandomId();
      const batch = dbBatch();

      const normalizedEmail = newUserData.email.toLowerCase().trim();

      // Create the user record
      batch.collection(PB_COLLECTIONS.USERS).create({
         organization: organization.id,
         id: newUserId,
         email: normalizedEmail,
         name: newUserData.name,
         role: "attendant",
         dateOfBirth: newUserData.dateOfBirth,
         phoneNumber: newUserData.phoneNumber,
      } satisfies User & { id: string });

      // Register the user to the congress
      const userRegistrationId = generateRandomId();
      batch.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).create({
         id: userRegistrationId,
         organization: organization.id,
         user: newUserId,
         congress: congress.id,
         hasAccessToRecordings: false,
         paymentConfirmed: false,
         registrationType: "regular",
      } satisfies CongressRegistration & { id: string });

      await batch.send();

      // Send the registration confirmation email
      await sendPlatformRegistrationConfirmationEmail(newUserId);

      const authData = await createUserAuthData(newUserId);
      await setRefreshTokenCookie(authData.refreshToken);
      await setAuthTokenCookie(authData.authToken);

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
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al registrar el usuario al congreso",
      };
   }
}

export async function logoutAction(): Promise<BackendResponse<{ successMessage: string }>> {
   try {
      const cookieStore = await cookies();
      cookieStore.delete(AUTH_COOKIE_KEY);
      cookieStore.delete(REFRESH_COOKIE_KEY);

      return {
         success: true,
         data: {
            successMessage: "Sesión cerrada correctamente",
         },
      };
   } catch (error) {
      console.error("[staggeredAuthAPI] Logout error:", error);
      return {
         success: false,
         errorMessage: "Ocurrió un error inesperado al cerrar sesión",
      };
   }
}
