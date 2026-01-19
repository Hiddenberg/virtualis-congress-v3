"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStaggeredAuthContext } from "@/features/staggeredAuth/context/StaggeredAuthContext";

export function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
   const { logout, isLoggedIn } = useStaggeredAuthContext();
   const router = useRouter();

   if (!isLoggedIn) {
      return null;
   }

   const handleLogout = () => {
      logout();
      router.push(redirectTo);
   };

   return (
      <button
         className="bg-red-500 p-2 px-4 rounded-xl text-white"
         onClick={handleLogout}
      >
         logout
      </button>
   );
}

export default function AuthHeader() {
   const { user, isLoggedIn } = useAuthContext();

   return (
      <div className="flex justify-evenly p-4 w-full">
         <span>LoggedIn?: {isLoggedIn ? "true" : "false"}</span>
         <span>User: {user?.name}</span>

         <LogoutButton />
      </div>
   );
}
