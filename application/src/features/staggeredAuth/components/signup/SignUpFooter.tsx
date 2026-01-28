"use client";

import { useSearchParams } from "next/navigation";

export default function SignUpFooter() {
   const redirectTo = useSearchParams().get("redirectTo");

   const loginUrl = redirectTo ? `/login?redirectTo=${redirectTo}` : "/login";

   return (
      <div className="mt-4">
         {/* Divider */}
         <div className="flex items-center my-8">
            <div className="flex-1 border-gray-300 border-t" />
            <span className="px-6 font-medium text-gray-500 text-sm">o</span>
            <div className="flex-1 border-gray-300 border-t" />
         </div>

         {/* Login prompt */}
         <div className="bg-linear-to-r from-gray-50 to-blue-50 shadow-sm p-6 border-2 border-gray-200 rounded-2xl text-center">
            <p className="mb-4 font-semibold text-gray-800 text-lg">¿Ya tienes una cuenta?</p>
            <a
               href={loginUrl}
               className="inline-block bg-linear-to-r from-gray-700 hover:from-gray-800 to-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 duration-200"
            >
               Inicia sesión aquí
            </a>
         </div>
      </div>
   );
}
