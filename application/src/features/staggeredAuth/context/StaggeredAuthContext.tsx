"use client";

import {
   createContext,
   ReactNode,
   useCallback,
   useContext,
   useEffect,
   useState,
} from "react";

import toast from "react-hot-toast";
import GlobalLoadingPage from "@/components/global/GlobalLoadingPage";
import { NewUserData } from "@/features/users/services/userServices";
import {
   authenticateWithBirthDateAction,
   authenticateWithOTPCodeAction,
   authenticateWithPhoneNumberAction,
   getUserAndRoleAction,
   logoutAction,
   requestOTPCodeAction,
   signupAction,
} from "../serverActions/staggeredAuthActions";

// import { removeTokenCookieAction, setTokenCookieAction } from '@/features/authentication/serverActions/authActions';

function useStaggeredAuth() {
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState<UserRecord | null>(null);
   const [userRole, setUserRole] = useState<RoleType | null>(null);

   useEffect(() => {
      const getUserData = async () => {
         try {
            const userResponse = await getUserAndRoleAction();

            if (!userResponse.success) {
               setUser(null);
               setUserRole(null);
               return;
            }

            setUser(userResponse.data.authUser);
            setUserRole(userResponse.data.userRole);
         } catch (error) {
            setUser(null);
            setUserRole(null);
            if (error instanceof Error) {
               console.log(error.message);
            }
         } finally {
            setIsLoading(false);
         }
      };

      getUserData();
   }, []);

   const isLoggedIn = user !== null;

   const requestOTPCode = useCallback(async (email: string) => {
      const response = await requestOTPCodeAction(email);

      if (response.success) {
         toast.success(response.data.successMessage);
      } else {
         toast.error(response.errorMessage);
      }

      return response.success;
   }, []);

   const loginWithOTPCode = useCallback(
      async (email: string, otpCode: string) => {
         try {
            const response = await authenticateWithOTPCodeAction(
               email,
               otpCode,
            );

            if (!response.success) {
               toast.error(response.errorMessage);
               return false;
            }

            setUser(response.data.user);
            setUserRole(response.data.userRole);

            return true;
         } catch (error) {
            if (error instanceof Error) {
               toast.error(error.message);
            }

            return false;
         }
      },
      [],
   );

   const loginWithBirthdate = useCallback(
      async (email: string, birthdate: string) => {
         try {
            const response = await authenticateWithBirthDateAction(
               email,
               birthdate,
            );

            if (!response.success) {
               toast.error(response.errorMessage);
               return false;
            }

            setUser(response.data.user);
            setUserRole(response.data.userRole);

            return true;
         } catch (error) {
            if (error instanceof Error) {
               toast.error(error.message);
            }

            return false;
         }
      },
      [],
   );

   const loginWithPhoneNumber = useCallback(
      async (email: string, phoneNumber: string) => {
         try {
            const response = await authenticateWithPhoneNumberAction(
               email,
               phoneNumber,
            );

            if (!response.success) {
               toast.error(response.errorMessage);
               return false;
            }

            setUser(response.data.user);
            setUserRole(response.data.userRole);

            return true;
         } catch (error) {
            if (error instanceof Error) {
               toast.error(error.message);
            }

            return false;
         }
      },
      [],
   );

   const signup = useCallback(async (userData: Omit<NewUserData, "role">) => {
      const signupResponse = await signupAction(userData);

      if (!signupResponse.success) {
         throw new Error(signupResponse.errorMessage);
      }

      return signupResponse.data.user;
   }, []);

   const logout = useCallback(async () => {
      try {
         const response = await logoutAction();

         if (response.success) {
            setUser(null);
            setUserRole(null);
            toast.success(response.data.successMessage);
         } else {
            toast.error(response.errorMessage);
         }
      } catch (error) {
         if (error instanceof Error) {
            toast.error(error.message);
         }
      }
   }, []);

   return {
      user,
      isLoggedIn,
      isLoading,
      userRole,
      logout,
      signup,
      requestOTPCode,
      loginWithOTPCode,
      loginWithBirthdate,
      loginWithPhoneNumber,
   };
}

const StaggeredAuthContext = createContext<ReturnType<
   typeof useStaggeredAuth
> | null>(null);

export function StaggeredAuthContextProvider({
   children,
}: {
   children: ReactNode;
}) {
   const staggeredAuth = useStaggeredAuth();

   if (staggeredAuth.isLoading) {
      return <GlobalLoadingPage />;
   }

   return (
      <StaggeredAuthContext.Provider value={staggeredAuth}>
         {children}
      </StaggeredAuthContext.Provider>
   );
}

export function useStaggeredAuthContext() {
   const authContext = useContext(StaggeredAuthContext);

   if (!authContext) {
      throw new Error(
         "useStaggeredAuthContext must be used within a StaggeredAuthContextProvider",
      );
   }

   return authContext;
}
