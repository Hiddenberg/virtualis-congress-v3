import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function SecurityNote() {
   const [pulsing, setPulsing] = useState(true);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setPulsing(false);
      }, 4000);

      return () => clearTimeout(timeout);
   }, []);

   return (
      <div
         className={`bg-linear-to-r from-blue-50 to-gray-50 p-6 border-2 border-blue-200 rounded-xl ${pulsing ? "animate-pulse" : ""} shadow-sm`}
      >
         <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
               <Shield className="w-6 h-6 text-blue-700" />
            </div>
            <div>
               <h4 className="mb-2 font-bold text-gray-800 text-base">Información importante</h4>
               <p className="text-gray-700 text-sm leading-relaxed">
                  Tu fecha de nacimiento y número de teléfono pueden ser utilizados para recuperar tu cuenta.
                  <br />
                  <br />
                  Por favor, asegúrate de que sean correctos y manténlos actualizados.
               </p>
            </div>
         </div>
      </div>
   );
}
