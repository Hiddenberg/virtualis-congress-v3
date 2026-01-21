/* eslint-disable @next/next/no-img-element */
import { CalendarDays, DoorOpenIcon, Monitor, Play } from "lucide-react";
import Link from "next/link";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import ACPConferencesPreview from "./ACPConferencesPreview";

interface HeroSectionProps {
   organization: OrganizationRecord;
   userId?: string;
   congress: CongressRecord;
   conferences: ConferenceWithSpeakers[];
}

export default function ACPHeroSection({ organization, userId, congress, conferences }: HeroSectionProps) {
   // const medicalOrganizationLogoUrl = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757620427/logo_sociedad_medica_wrgq6i.webp"

   return (
      <section className="relative flex items-center bg-linear-to-br from-teal-600 via-emerald-500 to-green-400 min-h-dvh">
         {/* Background accents */}
         <div className="absolute inset-0 opacity-40 w-full overflow-hidden">
            {Array.from({
               length: 8,
            }).map((_, index) => {
               const randomTop = Math.floor(Math.random() * 100);
               const randomLeft = Math.floor(Math.random() * 100);
               const randomSize = Math.floor(Math.random() * 8) + 8;
               return (
                  <div
                     key={index}
                     className="absolute border-2 border-white/20 rounded-full animate-pulse"
                     style={{
                        top: `${randomTop}%`,
                        left: `${randomLeft}%`,
                        width: `${randomSize}rem`,
                        height: `${randomSize}rem`,
                        animationDelay: `${index * 0.12}s`,
                     }}
                  />
               );
            })}
         </div>

         <div className="z-10 relative mx-auto px-4 md:px-10 py-12 container">
            <div className="gap-10 grid lg:grid-cols-2">
               {/* Left - Intro */}
               <div className="space-y-8 text-white">
                  <div className="flex flex-wrap items-center gap-2 md:*:h-20 *:h-13">
                     {organization.logoURL && (
                        <img
                           src={organization.logoURL}
                           alt={`${organization.name} logo`}
                           className="bg-white p-2 rounded-lg w-auto h-full object-contain"
                        />
                     )}
                     {/* <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757633836/ACP_Mexico_Chapter_EndorsedBy_Logo_rgb_1_kn5xnf.webp" alt={`medical organization logo`} className="bg-white p-2 rounded-lg w-auto h-full object-cover" /> */}
                     {/* <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757633841/image_1_ql4kbm.webp" alt={`medical organization logo`} className="bg-white p-2 rounded-lg w-auto h-full object-cover" />
                     <img src={medicalOrganizationLogoUrl} alt={`medical organization logo`} className="p-2 rounded-lg w-auto h-full object-cover" />
                     <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759255173/7b9e6e5c-e3dc-40d7-abd3-13acb1aa5c9b.webp" alt={`medical organization logo`} className="bg-white p-2 rounded-lg w-auto h-full object-cover" /> */}
                  </div>

                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/30 rounded-full font-semibold text-lime-100 text-xs">
                        <Monitor className="w-4 h-4" /> Congreso 100% en línea
                     </div>
                     <h1 className="font-bold text-4xl lg:text-5xl leading-tight">
                        <span className="text-white">Bienvenidos a la </span>
                        <span className="text-lime-200">{congress.title}</span>
                     </h1>
                     <p className="max-w-xl text-teal-100 text-lg">
                        Actualízate con las mejores conferencias en un formato digital accesible, sin traslados y desde cualquier
                        dispositivo.
                     </p>
                     <div className="gap-3 grid sm:grid-cols-3">
                        {/* <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-cyan-200" />
                              <span className="font-semibold text-white text-sm">Conferencias</span>
                           </div>
                           <div className="text-cyan-100 text-xs">{totalConferences} en total</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <Film className="w-4 h-4 text-cyan-200" />
                              <span className="font-semibold text-white text-sm">Grabaciones</span>
                           </div>
                           <div className="text-cyan-100 text-xs">Incluidas</div>
                        </div> */}
                     </div>
                  </div>

                  {/* Highlights */}
                  <div className="gap-4 grid grid-cols-2">
                     <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                           <CalendarDays className="w-4 h-4 text-cyan-200" />
                           <span className="font-semibold text-white text-xl">Fechas</span>
                        </div>
                        <div className="text-cyan-100">14 de noviembre 2025</div>
                     </div>
                     <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                        <div className="mb-1 font-bold text-white text-xl"> Grabaciones</div>
                        <div className="font-medium text-cyan-200">A demanda por 3 meses</div>
                     </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3">
                     <div className="flex sm:flex-row flex-col gap-3">
                        {!userId && (
                           <Link
                              href="/signup"
                              className="bg-white hover:bg-lime-50 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-teal-900 text-lg text-center hover:scale-105 transition-all duration-300 transform"
                           >
                              Inscribirme ahora
                           </Link>
                        )}
                        {/* <Link
                           href="#program-schedule"
                           className="flex justify-center items-center gap-2 hover:bg-white backdrop-blur-sm px-8 py-4 border-2 border-white/80 rounded-full !w-full md:!w-max font-bold text-white hover:text-blue-900 text-lg transition-all duration-300"
                        >
                           <Calendar className="w-5 h-5" /> Ver programa
                        </Link> */}
                        <Link
                           href="/lobby"
                           className="flex justify-center items-center gap-2 bg-white hover:bg-lime-50 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-teal-900 text-lg text-center hover:scale-105 transition-all duration-300 transform"
                        >
                           <DoorOpenIcon className="w-5 h-5" /> Entrar con mi cuenta
                        </Link>
                     </div>
                     <p className="flex items-center gap-2 text-teal-100 text-sm">
                        <Play className="w-4 h-4" /> Acceso desde web y móvil
                     </p>
                  </div>
               </div>

               {/* Right - Conferences preview */}
               <div className="flex justify-center">
                  <ACPConferencesPreview conferences={conferences} />
               </div>
            </div>
         </div>

         <div className="bottom-0 left-0 absolute bg-linear-to-t from-teal-600/60 to-transparent w-full h-24" />
      </section>
   );
}
