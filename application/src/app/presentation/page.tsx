import Image from "next/image";
import acpPublicidadHorizontalImage from "@/assets/publicidad-acp-horizontal.png";
import LanguageSelect from "@/components/presentation/LanguageSelector";

export default function PresentationVideo() {
   return (
      <div className="mx-auto max-w-(--breakpoint-xl) md:px-10 px-6 md:flex">
         <Image
            className="w-full md:w-2/3 max-w-5xl mx-auto mb-8 aspect-video rounded-xl"
            src={acpPublicidadHorizontalImage}
            alt="ACP Publicidad Horizontal"
         />
         <div className="px-4 md:w-1/3">
            <LanguageSelect />
         </div>
      </div>
   );
}
