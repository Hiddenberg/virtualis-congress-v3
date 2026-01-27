import "server-only";
import { format } from "@formkit/tempo";
import { cookies } from "next/headers";
import { getUserRole } from "@/features/users/services/userRoleServices";
import { getUserByEmail } from "@/features/users/services/userServices";
import type { User } from "@/features/users/types/userTypes";
import { createDBRecord, getDBRecordById } from "@/libs/pbServerClientNew";
import { AUTH_COOKIE_KEY, REFRESH_COOKIE_KEY } from "../constants/authConstants";
import { generateRefreshToken, generateUserAuthToken, getUserIdFromAuthToken, verifyUserAuthToken } from "./jwtServices";
import { deleteAllUserOTPCodes, verifyOTPCode } from "./otpServices";

export async function createUserAuthData(userId: string) {
   const authUser = await getDBRecordById<User>("USERS", userId);

   if (!authUser) {
      throw new Error("[getUserAuthData] User not found");
   }

   const refreshToken = await generateRefreshToken(userId);

   // Store the refresh token in the database
   await createDBRecord("USER_REFRESH_TOKENS", {
      user: userId,
      token: refreshToken,
   } satisfies UserRefreshToken);

   const authToken = await generateUserAuthToken(userId);

   const userRole = await getUserRole(userId);

   if (!userRole) {
      throw new Error("[createUserAuthData] User role not found");
   }

   const userAuthData: UserAuthData = {
      authUser,
      refreshToken,
      authToken,
      userRole: userRole.role,
   };

   return userAuthData;
}

export async function authenticateWithOTPCode(email: string, otpCode: string) {
   const user = await getUserByEmail(email);

   if (!user) {
      throw new Error("Este correo no está registrado por favor registrate para iniciar sesión");
   }

   const isValidOTPCode = await verifyOTPCode(user.id, otpCode);

   if (isValidOTPCode) {
      await deleteAllUserOTPCodes(user.id);

      const authData = await createUserAuthData(user.id);
      return authData;
   }

   throw new Error("Este código de verificación no es válido o ha expirado");
}

export async function authenticateWithBirthdate(email: string, birthday: string) {
   const user = await getUserByEmail(email);

   if (!user) {
      throw new Error("Este correo no está registrado por favor registrate para iniciar sesión");
   }

   if (!user.dateOfBirth) {
      throw new Error("La fecha de nacimiento no está registrada en el sistema");
   }

   const isCorrectBirthday = format(birthday, "YYYY-MM-DD") === format(user.dateOfBirth, "YYYY-MM-DD");
   if (isCorrectBirthday) {
      await deleteAllUserOTPCodes(user.id);
      const authData = await createUserAuthData(user.id);
      return authData;
   }

   throw new Error("La fecha de nacimiento no coincide con la registrada en el sistema");
}

export async function authenticateWithPhoneNumber(email: string, phoneNumber: string) {
   const user = await getUserByEmail(email);

   if (!user) {
      throw new Error("Este correo no está registrado por favor registrate para iniciar sesión");
   }

   if (!user.phoneNumber) {
      throw new Error("El número de teléfono no está registrado en el sistema");
   }

   const isCorrectPhoneNumber = user.phoneNumber.trim() === phoneNumber.trim();
   if (isCorrectPhoneNumber) {
      await deleteAllUserOTPCodes(user.id);
      const authData = await createUserAuthData(user.id);
      return authData;
   }

   throw new Error("El número de teléfono no coincide con el registrado en el sistema");
}

export async function getLoggedInUserId() {
   const cookieStore = await cookies();
   const authToken = cookieStore.get(AUTH_COOKIE_KEY);

   if (!authToken) {
      return null;
   }

   const isValidAuthToken = await verifyUserAuthToken(authToken.value);

   if (!isValidAuthToken) {
      return null;
   }

   const userId = getUserIdFromAuthToken(authToken.value);

   return userId;
}

export async function setAuthTokenCookie(authToken: string) {
   const cookieStore = await cookies();

   cookieStore.set(AUTH_COOKIE_KEY, authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      maxAge: 1000 * 60 * 15,
   });
}

export async function setRefreshTokenCookie(refreshToken: string) {
   const cookieStore = await cookies();

   cookieStore.set(REFRESH_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      maxAge: 1000 * 60 * 60 * 24 * 365,
   });
}
