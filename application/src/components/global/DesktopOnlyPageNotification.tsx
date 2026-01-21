import { ArrowRight, Laptop, Tablet } from "lucide-react";
import Image from "next/image";
import ACPLogo from "@/assets/acp-logo.png";
import { CopyLinkButton } from "../lobby/PreEventWelcomeCard";

export default function DesktopOnlyNotification() {
   return (
      <div className="md:hidden flex flex-col items-center p-4 min-h-screen">
         <Image src={ACPLogo} alt="ACP Logo" className="my-10 w-48 object-contain" />

         <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
            <div className="space-y-6 text-center">
               <div className="flex justify-center gap-4">
                  <Tablet className="w-8 h-8 text-blue-500" />
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                  <Laptop className="w-8 h-8 text-blue-500" />
               </div>

               <h1 className="font-semibold text-gray-900 text-2xl">Experiencia Optimizada</h1>

               <p className="px-4 text-gray-600">
                  Para disfrutar de la mejor experiencia en nuestra plataforma virtual, te recomendamos acceder desde una
                  computadora.
               </p>
            </div>

            <div className="flex justify-center my-4">
               <CopyLinkButton />
            </div>

            <div className="mt-8 pt-6 border-t text-gray-500 text-sm text-center">
               <p>Congreso Internacional de Medicina Interna</p>
            </div>
         </div>
      </div>
   );
}

export function DesktopOnlyWrapper({ children }: { children: React.ReactNode }) {
   return (
      <div>
         <DesktopOnlyNotification />
         <div className="hidden md:block">{children}</div>
      </div>
   );
}
