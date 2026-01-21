"use client";

import { ClientResponseError, type RecordModel } from "pocketbase";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { removeTokenCookieAction, setTokenCookieAction } from "@/actions/userActions";
import GlobalLoadingPage from "@/components/global/GlobalLoadingPage";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

function usePBAuth() {
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState<(User & RecordModel) | null>(null);
   const [authToken, setAuthToken] = useState<string | null>(null);

   useEffect(() => {
      if (pbClient.authStore.isValid) {
         setUser(pbClient.authStore.record as User & RecordModel);
         setAuthToken(pbClient.authStore.token);
      }

      const unsuscribe = pbClient.authStore.onChange(async (token, record) => {
         if (record === null) {
            setUser(null);
            setAuthToken(null);
            removeTokenCookieAction();
            return;
         }

         await setTokenCookieAction(token);

         setUser(record as User & RecordModel);
         setAuthToken(token);
      });

      setIsLoading(false);
      return () => {
         unsuscribe();
      };
   }, []);

   const isLoggedIn = user !== null;

   const loginWithPassword = useCallback(async (email: string, password: string) => {
      try {
         pbClient.collection("users").authWithPassword(email, password);
      } catch (error) {
         if (error instanceof ClientResponseError) {
            alert("Error al iniciar sesión");
            console.log("[AuthContext] Login error:", error);
         }
      }
   }, []);

   const requestOTPCode = useCallback(async (email: string) => {
      const otpResponse = await pbClient.collection(PB_COLLECTIONS.USERS).requestOTP(email);
      return otpResponse.otpId;
   }, []);

   const loginWithOTPCode = useCallback(async (otpId: string, otpCode: string) => {
      try {
         const authRecord = await pbClient.collection(PB_COLLECTIONS.USERS).authWithOTP(otpId, otpCode);
         await setTokenCookieAction(authRecord.token);
         return true;
      } catch (error) {
         if (error instanceof ClientResponseError) {
            if (error.message === "Invalid or expired OTP.") {
               alert("Código de autenticación inválido o caducado");
            } else {
               alert("Error al iniciar sesión");
            }
            console.log("[AuthContext] OTP login error:", error.message);
         }
         return false;
      }
   }, []);

   const logout = useCallback(() => {
      setIsLoading(true);
      pbClient.authStore.clear();
      setIsLoading(false);
   }, []);

   return {
      user,
      isLoggedIn,
      authToken,
      isLoading,
      loginWithPassword,
      logout,
      requestOTPCode,
      loginWithOTPCode,
   };
}

const AuthContext = createContext<ReturnType<typeof usePBAuth> | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
   const pbAuth = usePBAuth();

   if (pbAuth.isLoading) {
      return <GlobalLoadingPage />;
   }

   return <AuthContext.Provider value={pbAuth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
   const authContext = useContext(AuthContext);

   if (!authContext) {
      throw new Error("useAuth must be used within a AuthContextProvider");
   }

   return authContext;
}
