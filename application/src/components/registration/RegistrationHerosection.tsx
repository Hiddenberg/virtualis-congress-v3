import Image from "next/image";
import ACPLogoImage from "@/assets/acp-logo.png";
import ACPPromotionHorizontalImage from "@/assets/publicidad-acp-horizontal.png";
import ACPPromotionVerticalImage from "@/assets/publicidad-acp-vertical.png";
import HeaderBlack from "./HeaderBlack";
import RegistrationHomeButton from "./RegistrationHomeButton";
// import { LinkButton } from "../global/Buttons";
// import { HelpCircle } from "lucide-react";

export function LogoSection() {
   return (
      <div className="flex md:flex-row justify-between items-center md:mb-8 py-8">
         <Image className="w-48 object-contain" src={ACPLogoImage} alt="Logo Medicina" />
         {/* <ChangeLenguaje /> */}
         {/* <LinkButton target="_blank" href="https://wa.me/5619920940?text=Hola, necesito ayuda con mi registro al congreso" className="!px-4 !py-2">
            <span className="hidden md:inline-block">Ayuda / Help / Ajuda</span>
            <HelpCircle className="size-5" />
         </LinkButton> */}
      </div>
   );
}

export default function RegistrationHeroSection() {
   return (
      <div className="md:grid md:grid-cols-2 min-h-screen">
         <div className="px-4 md:px-10 py-8">
            <HeaderBlack />

            <LogoSection />

            <div className="space-y-4">
               <h1 className="font-bold text-yellow-400 text-3xl md:text-4xl leading-normal transition-colors">
                  Congreso Internacional de Medicina Interna: Conéctate con el futuro de la salud
               </h1>
               <p className="pb-5 text-black text-xl">
                  Avalado por el American College of Physicians, con ponentes de renombre y traducciones simultáneas para diversos
                  países. Todo 100% virtual y accesible desde cualquier lugar.
               </p>
            </div>

            <div className="mb-12 rounded-2xl h-44 overflow-hidden">
               <Image className="md:hidden w-full" src={ACPPromotionHorizontalImage} alt="ACP Promo" />
            </div>

            <RegistrationHomeButton />
         </div>

         <div className="hidden md:block">
            <Image className="rounded-l-3xl w-full h-full object-cover object-left" src={ACPPromotionVerticalImage} alt="" />
         </div>
      </div>
   );
}
