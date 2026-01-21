"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownProps {
   date: string;
   title: string;
}

export default function CountdownCard({
   date, // ISO string
   title,
}: CountdownProps) {
   const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
   });

   useEffect(() => {
      const timer = setInterval(() => {
         const now = new Date().getTime();
         const distance =
            new Date(date) // Convert ISO string to Date
               .getTime() - now;

         const days = Math.floor(distance / (1000 * 60 * 60 * 24));
         const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

         if (distance < 0) {
            setTimeLeft({
               days: 0,
               hours: 0,
               minutes: 0,
               seconds: 0,
            });
            // reload the page
            window.location.reload();
            clearInterval(timer);
            return;
         } else {
            setTimeLeft({
               days,
               hours,
               minutes,
               seconds,
            });
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [date]);

   const formatNumber = (num: number) => String(num).padStart(2, "0");

   const formatDate = (date: Date) => {
      return date.toLocaleDateString("es-ES", {
         day: "numeric",
         month: "long",
         year: "numeric",
      });
   };

   return (
      <div className="mx-auto w-full max-w-4xl">
         {/* Header Section */}
         <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
               <h1 className="font-bold text-slate-800 text-2xl md:text-3xl">{title}</h1>
            </div>
            <div className="flex justify-center items-center gap-2 mb-2 text-slate-600">
               <Calendar className="w-4 h-4" />
               <p className="text-base md:text-lg">{formatDate(new Date(date))}</p>
            </div>
            {timeLeft.days === 0 && <p className="text-slate-600 text-sm">El congreso comenzará pronto</p>}
         </div>

         {/* Countdown Card */}
         <div className="bg-white shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-slate-200 border-b">
               <p className="font-medium text-slate-700 text-center">Tiempo restante para el inicio</p>
            </div>

            {/* Countdown Display */}
            <div className="p-8">
               <div className="gap-4 md:gap-6 grid grid-cols-2 md:grid-cols-4">
                  {/* Days */}
                  <div className="text-center">
                     <div className="bg-slate-50 hover:shadow-md mb-3 p-4 md:p-6 border border-slate-200 rounded-xl transition-all">
                        <div className="font-mono font-bold text-slate-800 text-3xl md:text-4xl lg:text-5xl">
                           {formatNumber(timeLeft.days)}
                        </div>
                     </div>
                     <div className="font-semibold text-slate-500 text-xs md:text-sm uppercase tracking-wider">Días</div>
                  </div>

                  {/* Hours */}
                  <div className="text-center">
                     <div className="bg-slate-50 hover:shadow-md mb-3 p-4 md:p-6 border border-slate-200 rounded-xl transition-all">
                        <div className="font-mono font-bold text-slate-800 text-3xl md:text-4xl lg:text-5xl">
                           {formatNumber(timeLeft.hours)}
                        </div>
                     </div>
                     <div className="font-semibold text-slate-500 text-xs md:text-sm uppercase tracking-wider">Horas</div>
                  </div>

                  {/* Minutes */}
                  <div className="text-center">
                     <div className="bg-slate-50 hover:shadow-md mb-3 p-4 md:p-6 border border-slate-200 rounded-xl transition-all">
                        <div className="font-mono font-bold text-slate-800 text-3xl md:text-4xl lg:text-5xl">
                           {formatNumber(timeLeft.minutes)}
                        </div>
                     </div>
                     <div className="font-semibold text-slate-500 text-xs md:text-sm uppercase tracking-wider">Minutos</div>
                  </div>

                  {/* Seconds */}
                  <div className="text-center">
                     <div className="bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-md mb-3 p-4 md:p-6 border border-slate-300 rounded-xl transition-all">
                        <div className="font-mono font-bold text-slate-800 text-3xl md:text-4xl lg:text-5xl animate-pulse">
                           {formatNumber(timeLeft.seconds)}
                        </div>
                     </div>
                     <div className="font-semibold text-slate-500 text-xs md:text-sm uppercase tracking-wider">Segundos</div>
                  </div>
               </div>
            </div>

            {/* Card Footer */}
            <div className="bg-slate-50 px-6 py-4 border-slate-200 border-t">
               <div className="flex justify-center items-center gap-2">
                  <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
                  <p className="text-slate-600 text-sm">El contador se actualiza automáticamente</p>
               </div>
            </div>
         </div>
      </div>
   );
}
