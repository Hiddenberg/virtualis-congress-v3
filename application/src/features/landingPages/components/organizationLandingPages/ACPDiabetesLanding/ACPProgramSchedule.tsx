"use client";

import { Calendar } from "lucide-react";
import { useMemo, useState } from "react";

interface SimpleConference {
   id: string;
   title: string;
   shortDescription?: string;
   startTime: string;
   endTime: string;
}

interface DaySchedule {
   label: string;
   dateISO: string;
   conferences: SimpleConference[];
}

export default function ACPProgramSchedule({
   days,
   // startDateISO,
   // endDateISO,
   // totalConferences
}: {
   days: DaySchedule[];
   userId?: string;
   startDateISO: string;
   endDateISO: string;
   totalConferences: number;
}) {
   const [activeIdx, setActiveIdx] = useState(0);

   const formattedDays = useMemo(
      () =>
         days.map((d) => ({
            ...d,
            dayNum: new Date(d.dateISO).getDate(),
         })),
      [days],
   );

   const current = formattedDays[activeIdx];

   const formatTime = (iso: string) => {
      const date = new Date(iso);
      return date.toLocaleTimeString("es-MX", {
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   // const startDate = new Date(startDateISO)
   // const endDate = new Date(endDateISO)

   return (
      <section id="program-schedule" className="bg-gray-50 py-16">
         <div className="mx-auto px-4 container">
            {/* <div className="mb-10 text-center">
               <h2 className="mb-3 font-bold text-gray-900 text-4xl">Programa del congreso</h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">Consulta las conferencias organizadas por día</p>
            </div> */}

            {/* <div className="gap-6 grid md:grid-cols-3 mb-10">
               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Fechas</h3>
                  <p className="text-gray-600">
                     {startDate.toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                     })}
                     {' '}
                     -
                     {' '}
                     {endDate.toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                     })}
                  </p>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-purple-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Conferencias</h3>
                  <p className="text-gray-600">{totalConferences}</p>
                  <p className="text-gray-500 text-sm">Totales en el programa</p>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-rose-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Film className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Grabaciones</h3>
                  <p className="text-gray-600">Incluidas</p>
                  <p className="text-gray-500 text-sm">Acceso posterior al evento</p>
               </div>
            </div> */}

            {/* Day tabs */}
            <div className="flex justify-center mb-8">
               <div className="bg-white shadow-lg p-2 border border-gray-200 rounded-xl">
                  <div className="flex gap-2">
                     {formattedDays.map((d, idx) => (
                        <button
                           type="button"
                           key={d.dateISO}
                           onClick={() => setActiveIdx(idx)}
                           className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              idx === activeIdx
                                 ? "bg-linear-to-r from-teal-500 to-teal-600 text-white shadow-md"
                                 : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === activeIdx ? "bg-white/20" : "bg-teal-100 text-teal-600"}`}
                              >
                                 {d.dayNum}
                              </div>
                              <div className="text-left">
                                 <div className="font-bold">{d.label}</div>
                                 <div className="opacity-75 text-xs">{new Date(d.dateISO).toLocaleDateString("es-MX")}</div>
                              </div>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Current day content */}
            {current && (
               <div className="mx-auto max-w-4xl">
                  <div className="bg-white shadow-lg p-4 md:p-8 border border-gray-200 rounded-2xl">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="flex justify-center items-center bg-linear-to-br from-teal-500 to-teal-600 rounded-full w-12 h-12">
                           <span className="font-bold text-white text-lg">
                              <Calendar className="w-5 h-5" />
                           </span>
                        </div>
                        <div>
                           <h3 className="font-bold text-gray-900 text-2xl">{current.label}</h3>
                           <p className="font-medium text-teal-600">
                              {new Date(current.dateISO).toLocaleDateString("es-MX", {
                                 day: "numeric",
                                 month: "long",
                                 year: "numeric",
                              })}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-4 overflow-y-auto">
                        {current.conferences.map((conf) => (
                           <div
                              key={conf.id}
                              className="bg-white hover:shadow-lg border border-gray-200 hover:border-teal-300 rounded-xl overflow-hidden transition-all duration-300"
                           >
                              <div className="p-4 md:p-6">
                                 <div className="flex flex-col gap-3">
                                    <div className="bg-teal-100 px-3 py-1 rounded-lg w-max font-semibold text-teal-800 text-sm">
                                       {formatTime(conf.startTime)} - {formatTime(conf.endTime)}
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg">{conf.title}</h4>
                                    {conf.shortDescription && (
                                       <p className="text-gray-700 text-sm leading-relaxed">{conf.shortDescription}</p>
                                    )}
                                 </div>
                              </div>
                              <div className="bg-linear-to-r from-teal-400 via-emerald-400 to-green-500 h-1" />
                           </div>
                        ))}
                        {current.conferences.length === 0 && (
                           <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl text-gray-600 text-center">
                              Sin conferencias programadas para este día.
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </section>
   );
}
