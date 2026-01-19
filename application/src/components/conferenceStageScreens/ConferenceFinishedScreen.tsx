"use client";

import { format } from "@formkit/tempo";
import { useQuery } from "@tanstack/react-query";
import {
   CheckCircle2,
   FilmIcon,
   Home,
   Loader2Icon,
   MessageSquare,
} from "lucide-react";
import Link from "next/link";
import backendFetcher from "@/features/backendFetcher/utils/backendFetcher";

function GoToQnASection({ conferenceId }: { conferenceId: string }) {
   const {
      data: qnaSessionResponse,
      isLoading: isLoadingQnaSession,
      error: qnaSessionError,
   } = useQuery({
      queryKey: ["conference-qna", conferenceId],
      staleTime: 60 * 1000,
      queryFn: () =>
         backendFetcher<{ qnaSession: LivestreamSessionRecord | null }>(
            `/api/conferences/${conferenceId}/qna-session`,
         ),
   });

   if (qnaSessionError) {
      return (
         <div>
            <p>
               Error al obtener la sesión de preguntas y respuestas:{" "}
               {qnaSessionError.message}
            </p>
         </div>
      );
   }

   if (isLoadingQnaSession) {
      return <Loader2Icon className="size-5 animate-spin" />;
   }

   if (!qnaSessionResponse?.qnaSession) {
      return null;
   }

   if (qnaSessionResponse?.qnaSession) {
      return (
         <Link
            href={`/conference/${conferenceId}/QnA`}
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full sm:w-auto text-white transition-colors"
         >
            <MessageSquare className="size-5" />
            Ir a la sesión de preguntas y respuestas
         </Link>
      );
   }

   return null;
}

interface ConferenceFinishedScreenProps {
   conferenceTitle?: string;
   conferenceId: string;
   startTime?: string;
   isQna?: boolean;
}
export default function ConferenceFinishedScreen({
   conferenceTitle,
   conferenceId,
   startTime,
   isQna,
}: ConferenceFinishedScreenProps) {
   const formattedStartTime = startTime
      ? format({
           date: startTime,
           format: "DD MMM YYYY hh:mm A",
           tz: "America/Mexico_City",
        })
      : undefined;

   return (
      <div className="flex flex-col justify-center items-center bg-gray-50 mb-4 p-4 border border-gray-200 rounded-lg aspect-video">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="size-6 text-green-600" />
            <h2 className="font-semibold text-gray-900 text-lg">
               {isQna
                  ? "Sesión de preguntas y respuestas finalizada"
                  : "La transmisión ha finalizado"}
            </h2>
         </div>

         {conferenceTitle && (
            <p className="mt-1 text-gray-700 text-center">
               {conferenceTitle}
               {formattedStartTime
                  ? ` se transmitió ${formattedStartTime}`
                  : ""}
            </p>
         )}

         <p className="flex items-center gap-2 bg-yellow-50 mt-1 p-2 border border-yellow-200 rounded-md text-gray-700 text-sm">
            <FilmIcon className="size-5" />
            Las grabaciones estarán disponibles al terminar el evento
         </p>

         <div className="flex flex-col justify-center items-center gap-2 mt-4 w-full max-w-xl">
            {/* <p className="font-medium text-gray-600 text-center">
               {isQna ? "Gracias por acompañarnos." : "Gracias por acompañarnos. Puedes consultar la sesión de preguntas y respuestas o volver al lobby."}
            </p> */}

            {!isQna && <GoToQnASection conferenceId={conferenceId} />}

            <Link
               href={`/lobby`}
               className="flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-md w-full sm:w-auto text-white transition-colors"
            >
               <Home className="size-5" />
               Ir al lobby
            </Link>
         </div>
      </div>
   );
}
