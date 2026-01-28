"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { logoutAction } from "@/features/staggeredAuth/serverActions/staggeredAuthActions";

export default function LogoutButton() {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleLogout = () => {
      startTransition(async () => {
         const response = await logoutAction();

         if (response.success) {
            toast.success(response.data.successMessage);
            router.push("/login");
            router.refresh();
         } else {
            toast.error(response.errorMessage);
         }
      });
   };

   return (
      <button
         type="button"
         onClick={handleLogout}
         disabled={isPending}
         className="flex justify-center items-center gap-2 bg-linear-to-r from-red-600 hover:from-red-700 to-red-700 hover:to-red-800 disabled:opacity-50 shadow-lg hover:shadow-xl px-8 py-4 rounded-xl w-full font-bold text-white transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 duration-200 disabled:cursor-not-allowed"
      >
         <LogOutIcon className="size-4" />
         {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
   );
}
