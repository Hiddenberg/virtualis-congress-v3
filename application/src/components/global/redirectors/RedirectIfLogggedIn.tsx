"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import GlobalLoadingPage from "../GlobalLoadingPage";

export function RedirectIfLoggedIn({ children, to }: { children: React.ReactNode; to: string }) {
   const { isLoggedIn } = useAuthContext();
   const router = useRouter();

   useEffect(() => {
      if (isLoggedIn) {
         router.push(to);
      }
   }, [router, isLoggedIn, to]);

   if (!isLoggedIn) {
      return children;
   }

   return <GlobalLoadingPage />;
}
