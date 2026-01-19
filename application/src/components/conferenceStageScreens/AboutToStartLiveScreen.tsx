"use client";

import { format } from "@formkit/tempo";
import { Clock, Radio } from "lucide-react";

interface AboutToStartLiveScreenProps {
   conferenceTitle?: string;
   startTime?: string;
   serverTimeTz?: string;
}

export default function AboutToStartLiveScreen({
   conferenceTitle,
   startTime,
}: AboutToStartLiveScreenProps) {
   const formattedStartTime = startTime
      ? format({
           date: startTime,
           format: "DD MMM YYYY hh:mm A",
        })
      : undefined;

   return (
      <div className="flex flex-col justify-center items-center bg-blue-50 mb-4 p-4 border border-blue-200 rounded-lg aspect-video">
         <div className="flex items-center gap-2">
            <Radio className="size-6 text-blue-700" />
            <h2 className="font-semibold text-blue-900 text-lg">
               El anfitrión está preparando la transmisión
            </h2>
         </div>

         {conferenceTitle && (
            <p className="mt-1 text-blue-700 text-center">{conferenceTitle}</p>
         )}

         {formattedStartTime && (
            <div className="flex items-center gap-2 mt-2 text-blue-700">
               <Clock className="size-4" />
               <p>Inicio programado: {formattedStartTime}</p>
            </div>
         )}

         <div className="flex flex-col justify-center items-center gap-2 mt-4 w-full max-w-xl">
            <p className="font-medium text-blue-700 text-center">
               La transmisión comenzará en cuanto el anfitrión la inicie.
            </p>
            {/* <p className="text-blue-600 text-sm text-center">
               Si no inicia en un par de minutos, intenta recargar la página.
            </p> */}

            <div className="flex flex-wrap justify-center gap-2 mt-2">
               {/* <button
                  onClick={() => window.location.reload()}
                  className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
               >
                  <RefreshCw className="size-4" />
                  Recargar página
               </button> */}

               {/* <Link
                  href={`/lobby`}
                  className="flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-md text-white transition-colors"
               >
                  <Home className="size-4" />
                  Ir al lobby
               </Link> */}
            </div>
         </div>
      </div>
   );
}
