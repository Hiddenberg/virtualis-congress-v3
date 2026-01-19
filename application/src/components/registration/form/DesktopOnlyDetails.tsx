import Link from "next/link";
import HeaderBlack from "../HeaderBlack";
import { LogoSection } from "../RegistrationHerosection";

export default function DesktopOnlyDetails() {
   return (
      <div className="hidden md:block px-4 md:px-10 py-8">
         <HeaderBlack />

         <LogoSection />

         <div className="space-y-8">
            <h1 className="font-bold text-yellow-400 text-3xl md:text-4xl leading-normal transition-colors">
               Congreso Internacional de Medicina Interna: Conéctate con el
               futuro de la salud
            </h1>
            <p className="pb-5 text-black text-xl">
               Avalado por el American College of Physicians, con ponentes de
               renombre y traducciones simultáneas para diversos países. Todo
               100% virtual y accesible desde cualquier lugar.
            </p>
         </div>

         <div className="p-4 border-2 border-gray-400 rounded-xl">
            <h2 className="mb-2 font-semibold text-xl">
               ¿Ya completaste tu registro?
            </h2>
            <p>
               <Link
                  className="font-semibold text-[#F79C7D] underline"
                  href="/login"
               >
                  Haz clic aquí
               </Link>{" "}
               para proceder al pago y asegurar tu participación.
            </p>
         </div>
      </div>
   );
}
