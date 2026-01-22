/* eslint-disable @next/next/no-img-element */

import { ArrowRight, MessageCircle, Play, Presentation, TicketPercent, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PARTNERS_DEMO_CONSTANTS } from "@/data/partnersDemoConstants";

interface ActionItem {
   icon: ReactNode;
   title: string;
   description: string;
   href?: string;
}

function VideoPlaceholder() {
   return (
      <div className="relative bg-linear-to-br from-rose-400 via-rose-300 to-rose-200 border border-rose-300 rounded-2xl w-full aspect-video overflow-hidden">
         <div className="absolute inset-0 place-items-center grid">
            <div className="place-items-center grid bg-white/95 shadow p-6 rounded-full">
               <Play className="text-gray-900" size={36} />
            </div>
         </div>
         <img
            src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759264091/4c122642-a1ba-4012-b4ac-50d3e0a9e8e4.webp"
            alt="Sanfer video"
            className="w-full h-full object-cover aspect-video"
         />
      </div>
   );
}

function InfoCard() {
   return (
      <div className="relative bg-rose-50 p-5 border border-rose-200 rounded-2xl">
         <div className="top-4 right-4 absolute">
            <Link
               href="#contacto"
               className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 shadow px-3 py-1.5 rounded-full font-medium text-white text-sm"
            >
               <MessageCircle size={16} /> Contactar con un representante
            </Link>
         </div>
         <div className="flex flex-col items-start gap-4">
            <div className="place-items-center grid bg-white rounded-xl size-36">
               <Image src={PARTNERS_DEMO_CONSTANTS.SANFER_LOGO_URL} alt="Sanfer logo" width={80} height={80} unoptimized />
            </div>
            <div>
               <div className="flex items-center gap-1">
                  <h2 className="font-semibold text-gray-900 text-xl">Sanfer</h2>
                  <span className="text-gray-400">↗</span>
               </div>
               <p className="opacity-90 mt-2 text-gray-700 text-sm">
                  Innovación para la salud y bienestar animal. Beneficios exclusivos para los asistentes del congreso.
               </p>
            </div>
         </div>
      </div>
   );
}

function ActionCard({ icon, title, description, href = "#" }: ActionItem) {
   return (
      <Link
         href={href}
         className="flex flex-col justify-between bg-slate-900 shadow hover:brightness-110 p-5 rounded-2xl h-full text-slate-50"
      >
         <div className="flex items-start gap-3">
            <div className="place-items-center grid bg-rose-400 rounded-full w-9 h-9 text-slate-900">{icon}</div>
            <div>
               <h3 className="font-semibold text-lg leading-tight">{title}</h3>
               <p className="opacity-80 mt-2 text-sm">{description}</p>
            </div>
         </div>
         <div className="inline-flex justify-end items-center mt-4">
            <span className="place-items-center grid bg-rose-400 rounded-full w-8 h-8 text-slate-900">
               <ArrowRight size={18} />
            </span>
         </div>
      </Link>
   );
}

export default function SanferPartnerPageContent() {
   const actions: ActionItem[] = [
      {
         icon: <TicketPercent size={18} />,
         title: "¡Descubre tus Descuentos Exclusivos!",
         description: "Accede a ofertas y descuentos especiales en productos Sanfer, solo para asistentes del congreso.",
      },
      {
         icon: <Trophy size={18} />,
         title: "Participa en nuestro Sorteo",
         description: "Participa y gana productos Sanfer exclusivos. ¡Descubre más aquí!",
      },
      {
         icon: <Presentation size={18} />,
         title: "Explora Nuestras Charlas Exclusivas",
         description: "Infórmate sobre nuestras sesiones en vivo y descubre soluciones innovadoras. Conoce más y regístrate.",
      },
   ];

   return (
      <div className="flex flex-col gap-5 px-6 md:px-10 pb-10">
         <div className="gap-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px]">
            <VideoPlaceholder />
            <InfoCard />
         </div>

         <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((a) => (
               <ActionCard key={a.title} {...a} />
            ))}
         </div>

         <div className="place-items-center grid">
            <Link href="#mas" className="inline-flex items-center gap-2 text-gray-700 text-sm">
               Conocer más <span className="text-gray-400">▾</span>
            </Link>
         </div>
      </div>
   );
}
