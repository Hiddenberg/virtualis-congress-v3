import { format } from "@formkit/tempo";
import { CalendarDaysIcon, DoorOpenIcon, FilmIcon, MapPinIcon, MonitorIcon, PlayIcon } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import type { ConferenceWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import type {
   CongressLandingConfiguration,
   CongressLandingConfigurationRecord,
} from "@/features/congresses/types/congressLandingConfigurationsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import ConferencesPreview from "../GeaLanding/ConferencesPreview";
import GenericLandingLogos from "./GenericLandingLogos";
import ModalityBadge from "./ModalityBadge";

interface GenericHeroSectionProps {
   landingConfiguration: CongressLandingConfigurationRecord;
   organization: OrganizationRecord;
   userId?: string;
   congress: CongressRecord;
   conferences: ConferenceWithSpeakers[];
}

interface HeroSectionColorClasses {
   heroBgClass: string;
   heroTextAccentClass: string;
   heroButtonTextAccentClass: string;
   heroIconAccentClass: string;
   heroSecondaryTextClass: string;
   heroButtonHoverClass: string;
}

const colorClasses: Record<CongressLandingConfiguration["colorScheme"], HeroSectionColorClasses> = {
   green: {
      heroBgClass: "bg-linear-to-br from-green-800 via-green-600 to-green-400",
      heroTextAccentClass: "text-lime-100",
      heroButtonTextAccentClass: "text-lime-900",
      heroIconAccentClass: "text-lime-200",
      heroSecondaryTextClass: "text-lime-100",
      heroButtonHoverClass: "hover:bg-lime-50",
   },
   blue: {
      heroBgClass: "bg-linear-to-br from-blue-800 via-blue-700 to-cyan-600",
      heroTextAccentClass: "text-cyan-200",
      heroButtonTextAccentClass: "text-blue-900",
      heroIconAccentClass: "text-cyan-200",
      heroSecondaryTextClass: "text-cyan-100",
      heroButtonHoverClass: "hover:bg-cyan-50",
   },
   purple: {
      heroBgClass: "bg-linear-to-br from-[#3a1050] via-[#663399] to-[#e0cff0]",
      heroTextAccentClass: "text-[#e0cff0]",
      heroButtonTextAccentClass: "text-[#3a1050]",
      heroIconAccentClass: "text-[#e0cff0]",
      heroSecondaryTextClass: "text-[#e0cff0]/90",
      heroButtonHoverClass: "hover:bg-[#e0cff0]/20",
   },
};

function HeroAccents() {
   return (
      <div className="absolute inset-0 opacity-40 w-full overflow-hidden">
         {Array.from({
            length: 8,
         }).map((_, index) => {
            const randomTop = Math.floor(Math.random() * 100);
            const randomLeft = Math.floor(Math.random() * 100);
            const randomSize = Math.floor(Math.random() * 8) + 8;
            return (
               <div
                  key={nanoid()}
                  className="absolute border-2 border-white/30 rounded-full animate-pulse"
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
   );
}

export default function GenericHeroSection({
   organization,
   userId,
   congress,
   conferences,
   landingConfiguration,
}: GenericHeroSectionProps) {
   const color = landingConfiguration.colorScheme;
   const additionalLogosURLs = landingConfiguration.additionalLogosURLs;

   const formattedStartDate = format({
      date: congress.startDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });
   const formattedEndDate = format({
      date: congress.finishDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });
   const formattedYear = format({
      date: congress.startDate,
      format: "YYYY",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   // const totalConferences = conferences.length;
   const colors = colorClasses[color];

   return (
      <section className={`relative flex items-center min-h-dvh ${colors.heroBgClass}`}>
         {/* Background accents */}
         <HeroAccents />

         <div className="z-10 relative mx-auto px-4 md:px-10 py-12 container">
            <div className="gap-10 grid lg:grid-cols-2">
               {/* Left - Intro */}
               <div className="space-y-8 text-white">
                  <GenericLandingLogos organization={organization} additionalLogosURLs={additionalLogosURLs} />

                  <div className="space-y-4">
                     <ModalityBadge modality={congress.modality} colorScheme={color} />
                     <h1 className="font-bold text-4xl lg:text-5xl leading-tight">
                        <span className="text-white">Bienvenidos al evento:</span>
                        <br />
                        <span className={colors.heroTextAccentClass}>{congress.title}</span>
                     </h1>
                     {landingConfiguration.heroDescription && (
                        <p className={`max-w-xl text-lg ${colors.heroSecondaryTextClass}`}>
                           {landingConfiguration.heroDescription}
                        </p>
                     )}
                     {/* <div className="gap-3 grid sm:grid-cols-3">
                        <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <CalendarIcon className="w-4 h-4 text-cyan-200" />
                              <span className="font-semibold text-white text-sm">Conferencias</span>
                           </div>
                           <div className="text-cyan-100 text-xs">{totalConferences} en total</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <FilmIcon className="w-4 h-4 text-cyan-200" />
                              <span className="font-semibold text-white text-sm">Grabaciones</span>
                           </div>
                           <div className="text-cyan-100 text-xs">Incluidas</div>
                        </div>
                     </div> */}
                  </div>

                  {/* Highlights */}
                  <div className="gap-4 grid grid-cols-2">
                     <div className="bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                           <CalendarDaysIcon className={`w-4 h-4 ${colors.heroIconAccentClass}`} />
                           <span className="font-semibold text-white text-xl">Fechas</span>
                        </div>
                        <div className="capitalize">
                           {formattedStartDate} - {formattedEndDate} {formattedYear}
                        </div>
                     </div>
                     <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                        <span className="flex items-center gap-2 mb-1 font-bold text-white text-xl">
                           <FilmIcon className={`size-4 ${colors.heroIconAccentClass}`} /> Grabaciones
                        </span>
                        <div className="font-medium">A demanda por 3 meses</div>
                     </div>
                     {congress.modality === "hybrid" && congress.congressLocation && (
                        <div className="col-span-2 bg-white/10 backdrop-blur-sm p-3 border border-white/20 rounded-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <MapPinIcon className={`w-4 h-4 ${colors.heroIconAccentClass}`} />
                              <span className="font-semibold text-white text-xl">Ubicación</span>
                           </div>
                           <div className={`mb-2 ${colors.heroSecondaryTextClass}`}>{congress.congressLocation}</div>
                           <div className={`flex items-center gap-1 text-sm ${colors.heroIconAccentClass}`}>
                              <MonitorIcon className="size-4" />
                              <span className="font-bold">También disponible en línea</span>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                     <div className="flex sm:flex-row flex-col gap-3">
                        {!userId && (
                           <Link
                              href="/signup"
                              className={`bg-white shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-lg text-center hover:scale-105 transition-all duration-300 transform ${colors.heroButtonTextAccentClass} ${colors.heroButtonHoverClass}`}
                           >
                              Inscribirme ahora
                           </Link>
                        )}
                        <Link
                           href="/lobby"
                           className={`flex justify-center items-center gap-2 bg-white shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-bold text-lg text-center hover:scale-105 transition-all duration-300 transform ${colors.heroButtonTextAccentClass} ${colors.heroButtonHoverClass}`}
                        >
                           <DoorOpenIcon className="w-5 h-5" /> Entrar con mi cuenta
                        </Link>
                     </div>
                     <p className={`flex items-center gap-2 text-sm ${colors.heroSecondaryTextClass}`}>
                        <PlayIcon className="w-4 h-4" /> Acceso desde web y móvil
                     </p>
                  </div>
               </div>

               {/* Right - Conferences preview */}
               <div className="flex justify-center">
                  <ConferencesPreview conferences={conferences} />
               </div>
            </div>
         </div>
      </section>
   );
}
