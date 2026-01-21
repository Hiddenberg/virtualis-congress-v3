import Image from "next/image";
import whiteACPLogo from "@/assets/acp-logo-white.png";

export default function PresentationLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-[#17181E] py-10 w-screen min-h-screen overflow-hidden">
         <h1 className="mx-auto mb-10 w-max text-white text-3xl">
            <strong>Virtualis</strong> congress
         </h1>
         {children}
         <Image src={whiteACPLogo} className="w-48 object-contain mx-auto" alt="Logo ACP" />
      </div>
   );
}
