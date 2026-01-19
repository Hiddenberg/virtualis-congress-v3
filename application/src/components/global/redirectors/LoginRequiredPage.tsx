"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import GlobalLoadingPage from "../GlobalLoadingPage";

export default function LoginRequiredPage({
   children,
}: {
   children: React.ReactNode;
}) {
   const { isLoggedIn } = useAuthContext();
   const router = useRouter();
   const pathname = usePathname();

   useEffect(() => {
      if (!isLoggedIn) {
         router.push(`/login?redirectTo=${pathname}`);
      }
   }, [isLoggedIn, router, pathname]);

   if (!isLoggedIn) {
      return <GlobalLoadingPage />;
   }

   return children;
}
