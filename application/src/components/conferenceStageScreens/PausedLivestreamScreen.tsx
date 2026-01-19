"use client";

import { Clock, Radio, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function PausedLivestreamScreen() {
   const [elapsedTime, setElapsedTime] = useState(0);
   const [isReconnecting, setIsReconnecting] = useState(false);

   useEffect(() => {
      const timer = setInterval(() => {
         setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      // Toggle reconnecting animation every 3 seconds
      const reconnectingTimer = setInterval(() => {
         setIsReconnecting((prev) => !prev);
      }, 3000);

      return () => clearInterval(reconnectingTimer);
   }, []);

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
   };

   const isOverFiveMinutes = elapsedTime >= 300; // 5 minutes

   return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 to-orange-50 p-8 w-full aspect-video">
         <div className="space-y-8 mx-auto w-full max-w-lg text-center">
            <div className="flex flex-col items-center space-y-4">
               <div className="relative bg-amber-100 p-4 rounded-full">
                  {isReconnecting ? (
                     <Wifi className="w-16 h-16 text-amber-600 animate-pulse" />
                  ) : (
                     <WifiOff className="w-16 h-16 text-amber-600" />
                  )}
                  <div className="-top-1 -right-1 absolute bg-amber-500 rounded-full w-4 h-4 animate-ping" />
               </div>

               <h2 className="font-bold text-stone-900 text-2xl md:text-3xl">
                  Reconectando transmisión
               </h2>

               <p className="max-w-md text-stone-700 text-base md:text-lg">
                  El anfitrión se desconectó temporalmente de la transmisión.
                  Estamos trabajando para restablecer la conexión.
               </p>
            </div>

            <div className="space-y-4 bg-white/70 backdrop-blur-sm p-6 border border-amber-200 rounded-xl">
               <div className="flex justify-center items-center gap-3 mb-4">
                  <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
                  <p className="font-medium text-stone-700 text-sm md:text-base">
                     Intentando reconectar...
                  </p>
               </div>

               <div className="flex justify-center items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-stone-600" />
                  <span className="text-stone-600 text-sm">
                     Tiempo transcurrido: {formatTime(elapsedTime)}
                  </span>
               </div>

               <p className="text-stone-600 text-sm md:text-base">
                  Por favor, mantente en esta página. La transmisión se
                  restablecerá automáticamente.
               </p>

               {!isOverFiveMinutes ? (
                  <p className="text-stone-600 text-sm">
                     Tiempo estimado de reconexión: máximo 5 minutos
                  </p>
               ) : (
                  <div className="bg-orange-100 p-4 border border-orange-200 rounded-lg">
                     <p className="font-medium text-orange-800 text-sm">
                        La reconexión está tomando más tiempo del esperado
                     </p>
                     <p className="mt-1 text-orange-700 text-sm">
                        Por favor, actualiza la página o contacta al soporte
                        técnico si el problema persiste.
                     </p>
                  </div>
               )}

               <p className="font-semibold text-stone-700 text-sm">
                  Gracias por tu paciencia mientras restablecemos la conexión
               </p>
            </div>
         </div>
      </div>
   );
}
