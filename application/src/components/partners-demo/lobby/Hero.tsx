/* eslint-disable @next/next/no-img-element */
import { ChevronRight, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ACPLogoImage from "@/assets/acp-logo.png";
import ACPWhiteLogo from "@/assets/acp-logo-white.png";
import { PARTNERS_DEMO_CONSTANTS } from "@/data/partnersDemoConstants";

export function ACPHeader({ eventName }: { eventName: string }) {
   return (
      <div className="flex justify-between items-center gap-2 rounded-b-lg text-gray-500 text-sm">
         <Image src={ACPLogoImage} className="w-40" alt="ACP Logo" />
         <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700">
            <span className="text-xs">Estás en el evento:</span>
            <span className="font-medium text-xs truncate">{eventName}</span>
         </div>

         <div className="w-40" />
      </div>
   );
}

export function AbbottHeader() {
   return (
      <div className="flex justify-between items-center gap-2 bg-[#252e38] rounded-b-lg text-gray-500 text-sm">
         <img src={PARTNERS_DEMO_CONSTANTS.FREESTYLE_LOGO_URL} alt="FreeStyle Logo" className="w-20 md:w-40" />

         <Image src={ACPWhiteLogo} className="w-20 md:w-40" alt="ACP Logo" width={1024} />

         <img src={PARTNERS_DEMO_CONSTANTS.ABBOTT_LOGO_URL} className="w-20 md:w-40" alt="ACP Logo" width={1024} />
      </div>
   );
}

export function SanferHeader() {
   return (
      <div className="flex justify-between items-center gap-2 border-red-400 border-x-2 border-b-2 rounded-b-lg text-gray-500 text-sm">
         <img src={PARTNERS_DEMO_CONSTANTS.SANFER_LOGO_URL} alt="FreeStyle Logo" className="w-20 md:w-40" />

         <Image src={ACPLogoImage} className="w-20 md:w-40" alt="ACP Logo" width={1024} />

         <div className="w-20 md:w-40"> </div>
      </div>
   );
}

interface HeroProps {
   eventName: string;
   congressTitle: string;
   congressSubtitle: string;
}

export default function Hero({ eventName, congressTitle, congressSubtitle }: HeroProps) {
   return (
      <section className="px-6 md:px-10 pt-4">
         <ACPHeader eventName={eventName} />
         <div className="gap-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] mt-4">
            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
               <div className="inline-flex top-4 left-4 z-10 absolute items-center gap-2 bg-white/90 shadow-sm backdrop-blur px-3 py-1 rounded-full text-emerald-700 text-xs">
                  <span className="inline-flex relative justify-center items-center w-2 h-2">
                     <span className="inline-flex absolute bg-emerald-500 rounded-full w-2 h-2" />
                  </span>
                  Asistiendo
               </div>

               <Image
                  src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759261639/323c05e9-268e-4214-be8f-4c21d5c3d7ea.webp"
                  alt="Banner del congreso"
                  width={1280}
                  height={560}
                  className="w-full h-56 md:h-72 object-cover object-top-right"
                  priority
                  unoptimized
               />

               <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

               <div className="right-4 bottom-4 left-4 z-10 absolute text-white">
                  <h2 className="drop-shadow font-semibold text-2xl md:text-3xl">{congressTitle}</h2>
                  <p className="opacity-90 mt-1 text-sm md:text-base">{congressSubtitle}</p>
               </div>
            </div>

            <Link
               href="/partners-demo/commercial-zone"
               className="group relative bg-linear-to-br from-blue-600 to-indigo-400 shadow-md p-6 border border-blue-100 rounded-2xl overflow-hidden text-white"
            >
               <div className="top-[-40px] right-[-40px] z-20 absolute bg-white/10 blur-3xl rounded-full w-56 h-56" />
               <Store className="mb-4 size-10" />
               <div className="flex flex-col justify-between h-full">
                  <div>
                     <div className="inline-flex items-center gap-2">
                        <p className="opacity-90">Ir a la zona comercial</p>
                        <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                     </div>
                     <p className="opacity-80 mt-2 text-sm">
                        Informate sobre los últimos productos y novedades de nuestros patrocinadores.
                     </p>
                  </div>
                  <div className="inline-flex items-center gap-2 mt-5 font-medium text-sm">
                     Ir ahora <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
               </div>
            </Link>
         </div>
      </section>
   );
}
