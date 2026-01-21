"use client";

import { useState, useTransition } from "react";
import { submitQuestionPollAnswerAction } from "@/features/questionPolls/serverActions/questionPollActions";
import { useStaggeredAuthContext } from "@/features/staggeredAuth/context/StaggeredAuthContext";
import { useRealtimeQuestionPoll } from "../../contexts/RealtimeQuestionPollContext";

export default function RealtimeQuestionPollWidget() {
   const { questionPoll, questionPollOptions, questionPollAnswers } = useRealtimeQuestionPoll();
   const { user } = useStaggeredAuthContext();
   const userHasAnswered = user ? questionPollAnswers.some((answer) => answer.user === user.id) : false;

   const [selectedOptionId, setSelectedOptionId] = useState<string>(() => {
      if (userHasAnswered) {
         return questionPollAnswers.find((answer) => answer.user === user?.id)?.optionSelected ?? "";
      }
      return "";
   });
   const [message, setMessage] = useState<string | null>(null);
   const [isPending, startTransition] = useTransition();

   if (!questionPoll) return null;

   return (
      <section className="bg-white shadow mx-auto p-6 border border-blue-100 rounded-xl max-w-xl">
         <h2 className="mb-2 font-semibold text-blue-900 text-xl">Encuesta en tiempo real</h2>
         <p className="mb-6 text-gray-900 text-lg">{questionPoll.question}</p>

         <div className="mb-6">
            <h3 className="mb-2 font-medium text-blue-800 text-base">Opciones</h3>
            <ul className="space-y-2">
               {questionPollOptions.map((option) => (
                  <li
                     key={option.id}
                     className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-50 rounded-lg transition"
                  >
                     <label className="flex items-center gap-2 w-full cursor-pointer">
                        <input
                           type="radio"
                           name="pollOption"
                           value={option.id}
                           checked={selectedOptionId === option.id}
                           onChange={() => setSelectedOptionId(option.id)}
                           disabled={isPending || userHasAnswered}
                           className="w-4 h-4"
                        />
                        <span className="text-gray-900">{option.text}</span>
                     </label>
                     {userHasAnswered && (
                        <span className="bg-blue-100 ml-auto px-2 py-0.5 rounded text-blue-700 text-xs">
                           {questionPollAnswers.filter((a) => a.optionSelected === option.id).length} voto
                           {questionPollAnswers.filter((a) => a.optionSelected === option.id).length !== 1 ? "s" : ""}
                        </span>
                     )}
                  </li>
               ))}
            </ul>
         </div>

         {message && <div className="bg-green-50 mb-4 px-4 py-2 rounded text-green-700">{message}</div>}

         <div className="flex justify-end">
            <button
               type="button"
               onClick={() => {
                  if (!selectedOptionId) return;
                  setMessage(null);
                  startTransition(async () => {
                     const res = await submitQuestionPollAnswerAction({
                        pollId: questionPoll.id,
                        optionId: selectedOptionId,
                     });
                     if (!res.success) {
                        setMessage(res.errorMessage ?? "No se pudo registrar tu respuesta");
                        return;
                     }
                     setMessage("¡Gracias por participar!");
                  });
               }}
               className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded-md text-white"
               disabled={isPending || !selectedOptionId || userHasAnswered}
            >
               {userHasAnswered ? "Ya votaste" : isPending ? "Enviando..." : "Enviar respuesta"}
            </button>
         </div>

         {/* <div className="mt-6">
            <h3 className="mb-2 font-medium text-blue-800 text-base">Respuestas registradas</h3>
            <ul className="gap-2 grid grid-cols-2">
               {questionPollAnswers.map(answer => {
                  const option = questionPollOptions.find(o => o.id === answer.optionSelected)
                  return (
                     <li
                        key={answer.id}
                        className="bg-gray-50 px-3 py-1 border border-gray-100 rounded text-gray-700 text-sm truncate"
                        title={option?.text ?? answer.optionSelected}
                     >
                        {option?.text ?? <span className="text-gray-400 italic">Opción desconocida</span>}
                     </li>
                  )
               })}
               {questionPollAnswers.length === 0 && (
                  <li className="col-span-2 text-gray-400 italic">Aún no hay respuestas</li>
               )}
            </ul>
         </div> */}
      </section>
   );
}
