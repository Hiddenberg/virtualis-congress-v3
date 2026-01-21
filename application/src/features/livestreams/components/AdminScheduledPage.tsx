"use client";

import { CalendarIcon, ClockIcon, LinkIcon, MessagesSquareIcon, PlayIcon, TriangleAlertIcon, Video } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { startPreparingLivestreamSessionAction } from "@/features/livestreams/serverActions/livestreamSessionActions";

function LivestreamSessionHeader() {
   return (
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 shadow-lg mb-6 p-8 rounded-2xl">
         <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-100 p-4 rounded-xl">
               <Video className="w-8 h-8 text-stone-800" />
            </div>
            <div>
               <h1 className="font-bold text-stone-100 text-3xl">Transmisión Programada</h1>
               <p className="text-stone-300 text-lg">Prepara tu sesión en vivo</p>
            </div>
         </div>
      </div>
   );
}

function QnASessionHeader() {
   return (
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 shadow-lg mb-6 p-8 rounded-2xl">
         <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-100 p-4 rounded-xl">
               <MessagesSquareIcon className="w-8 h-8 text-stone-800" />
            </div>
            <div>
               <h1 className="font-bold text-stone-100 text-3xl">Sesión de preguntas programada</h1>
               <p className="text-stone-300 text-lg">Prepara tu sesión de preguntas y respuestas</p>
            </div>
         </div>
      </div>
   );
}

export default function AdminScheduledPage({
   livestreamSessionId,
   isQnASession,
}: {
   livestreamSessionId: string;
   isQnASession?: boolean;
}) {
   const [isPreparing, startTransition] = useTransition();

   // const { organizationBasePath } = useOrganizationContext()

   const handleStartPreparing = () => {
      startTransition(() => {
         startPreparingLivestreamSessionAction(livestreamSessionId);
      });
   };

   return (
      <div className="flex justify-center items-center bg-gradient-to-br from-stone-50 to-stone-100 p-4 min-h-screen">
         <div className="w-full max-w-2xl">
            {/* Header Section */}
            {isQnASession ? <QnASessionHeader /> : <LivestreamSessionHeader />}

            {/* Class Info Section */}
            <div className="bg-white shadow-lg mb-6 p-8 border border-stone-200 rounded-2xl">
               <div className="bg-gradient-to-r from-amber-50 to-amber-100 mb-6 p-6 rounded-xl">
                  {/* <h2 className="mb-2 font-semibold text-amber-800 text-2xl capitalize">
                     {classRecord.title}
                  </h2> */}
                  <div className="flex sm:flex-row flex-col gap-4 text-stone-600">
                     <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-amber-600" />
                        {/* <span className="font-medium">
                           {format({
                              date: classRecord.startTime,
                              format: "DD/MM/YYYY",
                           })}
                        </span> */}
                     </div>
                     <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-amber-600" />
                        {/* <span className="font-medium">
                           {format({
                              date: classRecord.startTime,
                              format: "hh:mm A",
                           })}
                        </span> */}
                     </div>
                  </div>
               </div>

               {/* Guest Link Section */}
               <div className="bg-gradient-to-r from-stone-50 to-stone-100 mb-6 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-stone-200 p-2 rounded-lg">
                        <LinkIcon className="w-5 h-5 text-stone-700" />
                     </div>
                     <h3 className="font-semibold text-stone-800 text-lg">Link de Invitado</h3>
                  </div>
                  <p className="mb-4 text-stone-600 text-sm">
                     Puede compartir este link para que alguien más pueda unirse a la transmisión
                  </p>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 mb-4 p-4 border border-amber-200 rounded-xl">
                     <div className="flex items-start gap-3">
                        <TriangleAlertIcon className="mt-0.5 w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                           <p className="mb-1 font-medium text-amber-800 text-sm">¡Importante!</p>
                           <p className="text-amber-700 text-xs">
                              No comparta este link públicamente. Solo debe ser utilizado por personas que necesiten unirse a la
                              transmisión como administradores o presentadores.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* <div className="flex items-center gap-3 bg-white p-4 border border-stone-200 rounded-xl">
                     <span className="flex-1 text-stone-600 text-sm truncate">
                        {`${PLATFORM_URL}${organizationBasePath}/live-transmission/${classRecord.id}`}
                     </span>
                     <CopyButton text={`${PLATFORM_URL}${organizationBasePath}/live-transmission/${classRecord.id}`} />
                  </div> */}
               </div>

               {/* Action Button */}
               <div className="text-center">
                  <Button
                     onClick={handleStartPreparing}
                     className={`bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 mx-auto ${isPreparing ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
                     disabled={isPreparing}
                  >
                     <PlayIcon className="w-5 h-5" />
                     {isPreparing ? "Iniciando..." : "Iniciar Preparación de Transmisión"}
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
