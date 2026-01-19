import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Action {
   label: string;
}

export interface Partner {
   id: string;
   name: string;
   description?: string;
   logoUrl: string;
   link?: string;
   tint: "blue" | "green" | "purple" | "pink" | "amber" | "sky";
   actions: Action[];
   isLarge?: boolean;
   darkBackground?: boolean;
}

const TINT_STYLES = {
   blue: "bg-blue-50 border-blue-100",
   green: "bg-emerald-50 border-emerald-100",
   purple: "bg-violet-50 border-violet-100",
   pink: "bg-pink-50 border-pink-100",
   amber: "bg-amber-50 border-amber-100",
   sky: "bg-sky-50 border-sky-100",
} as const;

export default function PartnerCard({
   name,
   description,
   logoUrl,
   link,
   tint,
   actions,
   isLarge = false,
   darkBackground = false,
}: Partner) {
   const CardInner = (
      <div
         className={`block h-full rounded-2xl border p-5 shadow-sm ${TINT_STYLES[tint]}`}
      >
         <div className="flex flex-col items-start gap-4">
            <div
               className={`flex justify-center items-center ${darkBackground ? "bg-gray-800" : "bg-white/70"} rounded-xl w-24 h-24`}
            >
               <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={72}
                  height={72}
                  className="w-16 h-16 object-contain"
                  unoptimized
               />
            </div>
            <div className="w-full">
               <div className="flex justify-between items-center w-full">
                  <h3 className="font-semibold text-gray-900 text-lg">
                     {name}
                  </h3>
                  {link ? (
                     <span className="inline-flex items-center gap-1 font-medium text-blue-700 text-xs">
                        Ver más <ChevronRight size={14} />
                     </span>
                  ) : (
                     <span className="text-gray-500 text-xs">Ver más</span>
                  )}
               </div>
               {description ? (
                  <p className="opacity-80 mt-2 text-gray-700 text-xs">
                     {description}
                  </p>
               ) : null}

               <div className="flex sm:flex-row flex-col sm:flex-wrap gap-2 mt-3">
                  {actions.map((a, idx) => (
                     <span
                        key={idx}
                        className="inline-flex justify-center items-center bg-white/70 shadow-sm px-3 py-2 rounded-md font-medium text-gray-700 text-xs"
                     >
                        {a.label}
                     </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <div className={`${isLarge ? "lg:col-span-2" : ""}`}>
         {link ? <Link href={link}>{CardInner}</Link> : CardInner}
      </div>
   );
}
