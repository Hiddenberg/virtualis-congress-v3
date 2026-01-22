/* eslint-disable @next/next/no-img-element */

import { Calendar, DoorOpenIcon, Monitor, Users } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { LinkButton } from "@/components/global/Buttons";

interface HeroSectionProps {
   // flyerImageUrl: string
   organizationLogoUrl: string;
   videoURL: string;
   userId?: string;
}

export default function HeroSection({
   // flyerImageUrl,
   organizationLogoUrl,
   videoURL,
   userId,
}: HeroSectionProps) {
   return (
      <div className="relative bg-linear-to-br from-blue-900 via-blue-700 to-cyan-600 min-h-dvh">
         {/* Subtle Background Elements */}
         <div className="absolute inset-0 opacity-50 w-full overflow-hidden">
            {Array.from({
               length: 10,
            }).map((_, index) => {
               const randomTop = Math.floor(Math.random() * 100);
               const randomLeft = Math.floor(Math.random() * 100);
               const randomSize = Math.floor(Math.random() * 10) + 10;
               return (
                  <div
                     key={nanoid()}
                     className={`absolute border-2 border-white/20 rounded-full animate-pulse duration-1000`}
                     style={{
                        top: `${randomTop}%`,
                        left: `${randomLeft}%`,
                        width: `${randomSize}rem`,
                        height: `${randomSize}rem`,
                        animationDelay: `${index * 0.1}s`,
                     }}
                  />
               );
            })}
         </div>

         <div className="z-10 relative mx-auto px-4 md:px-10 py-6 container">
            <div className="gap-12 grid lg:grid-cols-2">
               {/* Left Column - Simple Introduction */}
               <div className="space-y-8 lg:pr-8 text-white">
                  {/* Organization Logo */}
                  {organizationLogoUrl && (
                     <div className="mb-6">
                        <img src={organizationLogoUrl} alt="Organization Logo" className="w-auto h-20 object-contain" />
                     </div>
                  )}

                  {/* Welcome Message */}
                  <div className="space-y-6">
                     <div className="space-y-4">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/30 rounded-full font-semibold text-cyan-200 text-sm">
                           Colegio de Medicina Interna Costa de Chiapas
                        </div>

                        <h1 className="font-bold text-4xl lg:text-5xl leading-tight">
                           <span className="text-white">¡Te damos la bienvenida al</span>
                           <br />
                           <span className="text-cyan-200">XXIX Congreso Anual!</span>
                        </h1>
                     </div>

                     <div className="space-y-4">
                        <p className="font-medium text-cyan-100 text-xl leading-relaxed">
                           30 años comprometidos con el conocimiento, guiados por la vocación
                        </p>

                        <p className="text-white/90 text-lg leading-relaxed">
                           Únete a los mejores especialistas en medicina interna para dos días de actualización científica y
                           networking profesional en la costa de Chiapas.
                        </p>
                     </div>
                  </div>

                  {/* Hybrid Congress Highlight */}
                  <div className="bg-linear-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-sm p-4 border-2 border-cyan-300/40 rounded-2xl">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="bg-cyan-300 p-2 rounded-full">
                           <Monitor className="w-5 h-5 text-blue-900" />
                        </div>
                        <div className="bg-cyan-400/30 px-3 py-1 rounded-full">
                           <span className="font-bold text-cyan-100 text-sm">PRIMERO EN SU TIPO</span>
                        </div>
                     </div>
                     <h2 className="mb-1 font-bold text-white text-xl">🎉 Primer Congreso Híbrido</h2>
                     <p className="text-cyan-100 text-sm leading-relaxed">
                        Por primera vez, podrás participar tanto <span className="font-semibold text-white">presencialmente</span>{" "}
                        como <span className="font-semibold text-white">virtualmente</span>, gracias a nuestra plataforma.
                     </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="gap-4 grid grid-cols-2 lg:grid-cols-3">
                     <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                        <div className="mb-1 font-bold text-white text-2xl">2 Días</div>
                        <div className="font-medium text-cyan-200 text-sm">de Conocimiento</div>
                     </div>
                     <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                        <div className="mb-1 font-bold text-white text-2xl">30+</div>
                        <div className="font-medium text-cyan-200 text-sm">Ponencias</div>
                     </div>
                     <div className="col-span-2 lg:col-span-1 bg-linear-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm p-4 border-2 border-cyan-300/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                           <Users className="w-5 h-5 text-cyan-300" />
                           <div className="font-bold text-white text-lg">Híbrido</div>
                        </div>
                        <div className="font-medium text-cyan-200 text-sm">Presencial + Virtual</div>
                     </div>
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="space-y-4">
                     <div className="flex sm:flex-row flex-col gap-4">
                        <div className="flex flex-col gap-4">
                           {!userId && (
                              <Link
                                 href="/signup"
                                 className="bg-white hover:bg-cyan-50 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-blue-900 text-lg text-center hover:scale-105 transition-all duration-300 transform"
                              >
                                 ¡Inscribirme Ahora!
                              </Link>
                           )}

                           <Link
                              href="/lobby"
                              className="flex justify-center items-center gap-2 bg-white hover:bg-cyan-50 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-blue-900 text-lg text-center hover:scale-105 transition-all duration-300 transform"
                           >
                              <DoorOpenIcon className="w-5 h-5" />
                              Entrar con mi cuenta
                           </Link>
                        </div>

                        <LinkButton
                           variant="none"
                           href="#program-schedule"
                           className="flex justify-center items-center gap-2 hover:bg-white backdrop-blur-sm px-8 py-4 border-2 border-white/80 rounded-full !w-full md:!w-max font-bold text-white hover:text-blue-900 text-lg transition-all duration-300"
                        >
                           <Calendar className="w-5 h-5" />
                           Ver Programa
                        </LinkButton>
                     </div>

                     <p className="text-cyan-200 text-sm">* Todos los detalles del evento están en el programa oficial →</p>
                  </div>
               </div>

               {/* Right Column - Flyer Image (Main Focus) */}
               <div className="top-4 sticky flex justify-center w-full h-max">
                  <div className="group relative">
                     <div className="absolute -inset-4 bg-linear-to-r from-cyan-400 to-blue-400 opacity-30 group-hover:opacity-50 rounded-3xl transition duration-1000 group-hover:duration-200 blur" />

                     <video
                        className="relative shadow-2xl border-4 border-white/30 rounded-2xl w-full h-auto max-h-[90dvh] group-hover:scale-102 transition-all duration-500 transform"
                        src={videoURL}
                        autoPlay
                        loop
                        muted
                        playsInline
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Gradient Overlay */}
         <div className="bottom-0 left-0 absolute bg-gradient-to-t from-blue-900/80 to-transparent w-full h-32" />
      </div>
   );
}
