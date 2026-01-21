"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface GoBackButtonProps {
   className?: string;
   backURL?: string;
   backButtonText?: string;
   children?: React.ReactNode;
}

export default function GoBackButton({ className = "", backURL, backButtonText, children }: GoBackButtonProps) {
   const router = useRouter();
   const handleGoBack = () => {
      if (backURL) {
         router.push(backURL);
      } else {
         router.back();
      }
   };

   return (
      <button
         onClick={handleGoBack}
         className={`${className} flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-semibold text-gray-700 transition-colors duration-200`}
      >
         {children || (
            <>
               <ArrowLeft className="w-4 h-4" />
               {backButtonText || "Volver Atrás"}
            </>
         )}
      </button>
   );
}
