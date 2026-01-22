"use client";

import { Calendar, ClipboardPenIcon, DoorOpenIcon, DownloadIcon, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConferenceItem from "./ConferenceItem";

interface Conference {
   title: string;
   description: string;
   speakerName: string;
   startTime: string;
   endTime: string;
}

interface ProgramScheduleProps {
   conferencesDay1: readonly Conference[];
   conferencesDay2: readonly Conference[];
   userId?: string;
}

export default function ProgramSchedule({ conferencesDay1, conferencesDay2, userId }: ProgramScheduleProps) {
   const [activeDay, setActiveDay] = useState<1 | 2>(1);

   const isBreakSession = (title: string) => {
      return title.toLowerCase().includes("coffee") || title.toLowerCase().includes("break");
   };

   const currentConferences = activeDay === 1 ? conferencesDay1 : conferencesDay2;

   return (
      <div id="program-schedule" className="bg-gray-50 py-16">
         <div className="mx-auto px-4 container">
            {/* Section Header */}
            <div className="mb-12 text-center">
               <h2 className="mb-4 font-bold text-gray-900 text-4xl">Programa del Congreso</h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">
                  Dos días intensivos de conocimiento médico especializado con los mejores expertos en medicina interna
               </p>
            </div>

            {/* Event Info Cards */}
            <div className="gap-6 grid md:grid-cols-3 mb-12">
               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Fechas</h3>
                  <p className="text-gray-600">5 y 6 de Septiembre</p>
                  <p className="text-gray-500 text-sm">8:00 - 15:00 hrs</p>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Ubicación</h3>
                  <p className="text-gray-600">Hotel Holiday Inn</p>
                  <p className="text-gray-500 text-sm">Tapachula, Chiapas</p>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-purple-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Expertos</h3>
                  <p className="text-gray-600">Especialistas Reconocidos</p>
                  <p className="text-gray-500 text-sm">Ponencias de alto nivel</p>
               </div>
            </div>

            {/* Day Tabs */}
            <div className="mb-8">
               <div className="flex justify-center">
                  <div className="bg-white shadow-lg p-2 border border-gray-200 rounded-xl">
                     <div className="flex gap-2">
                        <button
                           type="button"
                           onClick={() => setActiveDay(1)}
                           className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              activeDay === 1
                                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                 : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    activeDay === 1 ? "bg-white/20" : "bg-blue-100 text-blue-600"
                                 }`}
                              >
                                 1
                              </div>
                              <div className="text-left">
                                 <div className="font-bold">Día 1</div>
                                 <div className="opacity-75 text-xs">5 Septiembre</div>
                              </div>
                           </div>
                        </button>

                        <button
                           type="button"
                           onClick={() => setActiveDay(2)}
                           className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              activeDay === 2
                                 ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md"
                                 : "text-gray-600 hover:text-cyan-600 hover:bg-cyan-50"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    activeDay === 2 ? "bg-white/20" : "bg-cyan-100 text-cyan-600"
                                 }`}
                              >
                                 2
                              </div>
                              <div className="text-left">
                                 <div className="font-bold">Día 2</div>
                                 <div className="opacity-75 text-xs">6 Septiembre</div>
                              </div>
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center pb-4">
               <Link
                  target="_blank"
                  href="/CMIMCC/files/programa-CMIMCC.pdf"
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 border border-to-blue-500 rounded-full max-w-max font-bold text-blue-600 transition-colors"
               >
                  <DownloadIcon className="w-4 h-4" />
                  Descargar programa
               </Link>
            </div>

            {/* Selected Day Content */}
            <div className="mx-auto max-w-4xl">
               <div className="bg-white shadow-lg p-4 md:p-8 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                     <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                           activeDay === 1
                              ? "bg-linear-to-br from-blue-500 to-blue-600"
                              : "bg-linear-to-br from-cyan-500 to-cyan-600"
                        }`}
                     >
                        <span className="font-bold text-white text-lg">{activeDay}</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 text-2xl">Día {activeDay}</h3>
                        <p className={`font-medium ${activeDay === 1 ? "text-blue-600" : "text-cyan-600"}`}>
                           {activeDay === 1 ? "5 de Septiembre, 2025" : "6 de Septiembre, 2025"}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-4 max-h-[80dvh] overflow-y-auto">
                     {currentConferences.map((conference, index) => (
                        <ConferenceItem key={conference.title} {...conference} isBreak={isBreakSession(conference.title)} />
                     ))}
                  </div>
               </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
               <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-2xl text-white">
                  <h3 className="mb-4 font-bold text-2xl">¿Listo para participar?</h3>
                  <p className="mb-6 text-blue-100">No te pierdas esta oportunidad única de actualización en medicina interna</p>
                  <div className="flex justify-center items-center gap-4">
                     {!userId && (
                        <Link
                           href="/signup"
                           className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full max-w-max font-bold text-blue-600 transition-colors"
                        >
                           <ClipboardPenIcon className="w-4 h-4" />
                           Registrarse Ahora
                        </Link>
                     )}

                     <Link
                        href="/lobby"
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full max-w-max font-bold text-blue-600 transition-colors"
                     >
                        <DoorOpenIcon className="w-4 h-4" />
                        Entrar con mi cuenta
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
