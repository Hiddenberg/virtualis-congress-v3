"use client";

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { LinkButton } from "../global/Buttons";

export default function RegistrationHomeButton() {
   const { isLoggedIn } = useAuthContext();

   return (
      <div className="space-y-8">
         {isLoggedIn ? (
            <LinkButton className="mx-auto px-20 w-80 text-xl" href="/lobby">
               Entrar al Congreso
            </LinkButton>
         ) : (
            <>
               <LinkButton className="!bg-green-400 hover:!bg-green-500 mx-auto px-20 w-max text-[1.5rem]" href="/login">
                  Ya me registré al Congreso
               </LinkButton>
               <LinkButton className="mx-auto px-20 w-80 text-xl" href="/registro/formulario">
                  Registrarme al Congreso
               </LinkButton>
            </>
         )}

         <Link href="#info" className="flex flex-col items-center gap-2">
            <ArrowDown className="size-8" />
            <span className="font-medium text-black">Descubre más</span>
         </Link>
      </div>
   );
}
