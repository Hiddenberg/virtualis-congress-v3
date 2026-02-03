/* eslint-disable @next/next/no-img-element */

import { format } from "@formkit/tempo";
import { Calendar, Clock, QrCode, Users } from "lucide-react";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import FixedScaleStage from "./FixedScaleStage";
import LobbyQrCodeWidget from "./LobbyQrCodeWidget";

export default async function StandbyScreen({
   nextConference,
   organization,
   congress,
}: {
   nextConference: CongressConferenceRecord | null;
   organization: OrganizationRecord;
   congress: CongressRecord;
}) {
   const conferenceSpeakers = await getConferenceSpeakers(nextConference?.id ?? "");
   const conferenceSpeaker = conferenceSpeakers[0] ?? null;

   return (
      <div className="top-0 left-0 fixed bg-[url(https://res.cloudinary.com/dnx2lg7vb/image/upload/v1756937736/Cmim_background_t4ej4c.webp)] bg-cover bg-center p-4 w-dvw min-h-dvh">
         <FixedScaleStage baseWidth={1400} baseHeight={880} className="mx-auto">
            {/* header */}
            <div
               className="items-center gap-4 grid grid-cols-12 mx-auto mb-4"
               style={{
                  maxWidth: 1400,
               }}
            >
               <div className="flex items-center gap-3 md:gap-4 col-span-12 md:col-span-3 *:h-28 *:w-auto *:object-contain *:rounded-lg *:bg-white">
                  <img src={organization.logoURL ?? ""} alt={`${organization.name} logo`} />
               </div>
               <div className="col-span-12 md:col-span-6">
                  <div className="flex justify-center items-center bg-blue-50/70 shadow-sm border border-slate-300 rounded-xl h-12 font-semibold text-slate-800 text-lg">
                     {congress?.title}
                  </div>
               </div>
               <div className="col-span-12 md:col-span-3">
                  <div className="flex justify-center items-center bg-white/70 shadow-sm border border-slate-300 rounded-xl h-12 font-medium text-slate-700 text-sm">
                     En breve
                  </div>
               </div>
            </div>

            {/* Enhanced body with modern card design */}
            <div
               className="gap-8 grid grid-cols-12 mx-auto"
               style={{
                  maxWidth: 1400,
               }}
            >
               {/* Left: Enhanced next conference card */}
               <div className="col-span-8">
                  <div className="bg-white shadow-xl border border-slate-200/60 rounded-3xl h-[750px] overflow-hidden">
                     {nextConference ? (
                        <div>
                           {/* Card header with modern status badge */}
                           <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-8 py-6 border-slate-200/60 border-b">
                              <div className="flex justify-between items-start">
                                 <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 border border-blue-200 rounded-full">
                                       <div className="bg-blue-500 rounded-full w-2.5 h-2.5 animate-pulse" />
                                       <span className="font-semibold text-blue-700 text-sm">Próxima conferencia</span>
                                    </div>
                                    <h2 className="font-bold text-slate-900 text-3xl leading-tight">{nextConference.title}</h2>
                                 </div>
                              </div>
                           </div>

                           {/* Conference details */}
                           <div className="p-8">
                              {/* Vertical congress video */}
                              <div className="relative flex justify-center mb-6">
                                 {/* <div className="relative bg-black shadow-lg border border-slate-200 rounded-2xl w-[320px] aspect-9/16 overflow-hidden">
                                    <video
                                       src={congressVideoUrl}
                                       className="absolute inset-0 w-full h-full object-cover"
                                       autoPlay
                                       muted
                                       loop
                                       playsInline
                                    />
                                 </div> */}
                              </div>
                              <div className="space-y-6">
                                 {/* Date and time with icon */}
                                 <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl">
                                    <Calendar className="w-5 h-5 text-slate-600" />
                                    <span className="font-medium text-slate-700 text-lg">
                                       {format({
                                          date: nextConference.startTime,
                                          format: "DD MMM YYYY hh:mm A",
                                          locale: "es-MX",
                                          tz: "America/Mexico_City",
                                       })}
                                    </span>
                                 </div>

                                 {/* Speaker info if available */}
                                 {conferenceSpeaker && (
                                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl">
                                       <Users className="w-5 h-5 text-slate-600" />
                                       <span className="font-medium text-slate-700 text-lg">{conferenceSpeaker.displayName}</span>
                                    </div>
                                 )}

                                 {/* Status message with modern styling */}
                                 <div className="flex justify-center items-center bg-linear-to-br from-slate-50 to-slate-100 mt-8 p-8 border border-slate-200 rounded-2xl">
                                    <div className="space-y-2 text-center">
                                       <div className="flex justify-center items-center bg-blue-100 mx-auto rounded-full w-16 h-16">
                                          <Clock className="w-8 h-8 text-blue-600" />
                                       </div>
                                       <p className="font-semibold text-slate-700 text-lg">La conferencia comenzará pronto</p>
                                       <p className="text-slate-500 text-sm">Prepárate para una experiencia increíble</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="flex flex-1 justify-center items-center h-full">
                           <div className="space-y-4 text-center">
                              <div className="flex justify-center items-center bg-slate-100 mx-auto rounded-full w-16 h-16">
                                 <Calendar className="w-8 h-8 text-slate-400" />
                              </div>
                              {/* <p className="font-medium text-slate-600 text-lg">No hay conferencias programadas</p> */}
                              <p className="text-slate-400 text-sm">Mantente atento a las próximas actualizaciones</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Right: Enhanced sidebar with modern cards */}
               <div className="flex flex-col gap-6 col-span-4">
                  {/* QR Code section with improved design */}
                  <div className="bg-white shadow-xl p-6 border border-slate-200/60 rounded-3xl">
                     <div className="space-y-4 text-center">
                        <div className="flex justify-center items-center gap-2 mb-4">
                           <QrCode className="w-5 h-5 text-blue-600" />
                           <h3 className="font-bold text-slate-900 text-lg">Accede a la plataforma</h3>
                        </div>

                        <div className="flex justify-center">
                           <LobbyQrCodeWidget />
                        </div>

                        <div className="bg-blue-50 px-4 py-3 rounded-xl">
                           <p className="font-medium text-blue-800 text-sm">
                              Escanea el código QR para participar desde tu dispositivo
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Organization info with enhanced styling */}
                  <div className="bg-white shadow-xl p-6 border border-slate-200/60 rounded-3xl">
                     <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-base">{organization.name}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{congress.title}</p>

                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 mt-4 px-4 py-3 rounded-xl">
                           <p className="font-medium text-blue-700 text-xs text-center">
                              Experiencia virtual de calidad profesional
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </FixedScaleStage>
      </div>
   );
}
