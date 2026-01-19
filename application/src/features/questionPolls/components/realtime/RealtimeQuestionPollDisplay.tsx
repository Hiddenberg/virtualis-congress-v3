"use client";

import { BarChart3, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeQuestionPoll } from "../../contexts/RealtimeQuestionPollContext";

export default function RealtimeQuestionPollDisplay() {
   const { questionPoll, questionPollOptions, questionPollAnswers } =
      useRealtimeQuestionPoll();

   const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>(
      {},
   );
   const countsRef = useRef<Record<string, number>>({});

   // Calculate totals
   const totalVotes = questionPollAnswers.length;

   const results = useMemo(() => {
      const totalAnswers = questionPollAnswers.length;
      const optionIdToVotesMap = new Map<string, number>();

      questionPollOptions.forEach((option) =>
         optionIdToVotesMap.set(option.id, 0),
      );
      questionPollAnswers.forEach((answer) => {
         optionIdToVotesMap.set(
            answer.optionSelected,
            (optionIdToVotesMap.get(answer.optionSelected) ?? 0) + 1,
         );
      });

      return questionPollOptions
         .map((option) => {
            const votesForOption = optionIdToVotesMap.get(option.id) ?? 0;
            const percentage =
               totalAnswers === 0
                  ? 0
                  : Math.round((votesForOption / totalAnswers) * 100);
            return {
               option,
               votes: votesForOption,
               percentage,
            };
         })
         .sort((a, b) => b.votes - a.votes);
   }, [questionPollOptions, questionPollAnswers]);

   // Animate vote counts
   useEffect(() => {
      const targetCountsByOptionId = Object.fromEntries(
         results.map((result) => [result.option.id, result.votes]),
      );

      const hasCountsChanged = Object.keys(targetCountsByOptionId).some(
         (optionId) =>
            targetCountsByOptionId[optionId] !==
            (countsRef.current[optionId] ?? 0),
      );
      if (!hasCountsChanged) return;

      const startCountsByOptionId = {
         ...countsRef.current,
      };
      const animationStartTimestamp = Date.now();
      const animationDurationMs = 800;

      const animateCounts = () => {
         const progress = Math.min(
            (Date.now() - animationStartTimestamp) / animationDurationMs,
            1,
         );
         const easedProgress = 1 - (1 - progress) ** 3;

         const nextCountsByOptionId: Record<string, number> = {};
         Object.keys(targetCountsByOptionId).forEach((optionId) => {
            const startCount = startCountsByOptionId[optionId] ?? 0;
            const targetCount = targetCountsByOptionId[optionId];
            nextCountsByOptionId[optionId] = Math.round(
               startCount + (targetCount - startCount) * easedProgress,
            );
         });

         setAnimatedCounts(nextCountsByOptionId);
         countsRef.current = nextCountsByOptionId;

         if (progress < 1) requestAnimationFrame(animateCounts);
      };

      requestAnimationFrame(animateCounts);
   }, [results]);

   if (!questionPoll) {
      return (
         <div className="flex flex-col justify-center items-center p-12 text-gray-500">
            <BarChart3 className="opacity-50 mb-4 w-16 h-16" />
            <p className="font-medium text-xl">No hay encuesta activa</p>
         </div>
      );
   }

   return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl mx-auto p-8 rounded-2xl w-full max-w-4xl">
         <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 shadow-sm backdrop-blur-sm mb-4 px-6 py-3 rounded-full">
               <BarChart3 className="w-6 h-6 text-blue-600" />
               <span className="font-semibold text-blue-900 text-lg">
                  Encuesta en Vivo
               </span>
            </div>
            <h2 className="mb-2 font-bold text-gray-900 text-3xl">
               {questionPoll.question}
            </h2>
            <div className="flex justify-center items-center gap-2 text-gray-600">
               <Users className="w-5 h-5" />
               <span className="font-medium text-lg">
                  {totalVotes} respuesta{totalVotes !== 1 ? "s" : ""}
               </span>
            </div>
         </div>

         <div className="space-y-4">
            {results.map((result, index) => {
               const animatedVotesForOption =
                  animatedCounts[result.option.id] ?? 0;
               const isLeading = index === 0 && result.votes > 0;

               return (
                  <div
                     key={result.option.id}
                     className={`relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm transition-all duration-500 ${
                        isLeading ? "ring-2 ring-blue-300 scale-[1.02]" : ""
                     }`}
                     style={{
                        animation: `slideInUp 0.6s ease-out ${index * 100}ms forwards`,
                     }}
                  >
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="flex-1 font-semibold text-gray-900 text-xl">
                           {result.option.text}
                        </h3>
                        <div className="flex items-center gap-4">
                           <span className="font-bold text-blue-600 text-2xl">
                              {animatedVotesForOption}
                           </span>
                           <span className="font-medium text-gray-600 text-lg">
                              {result.percentage}%
                           </span>
                        </div>
                     </div>

                     <div className="relative bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                           className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                              isLeading
                                 ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                 : "bg-gradient-to-r from-gray-400 to-gray-500"
                           }`}
                           style={{
                              width: `${result.percentage}%`,
                              boxShadow:
                                 result.percentage > 0
                                    ? "0 2px 8px rgba(59, 130, 246, 0.3)"
                                    : "none",
                           }}
                        />
                        {isLeading && (
                           <div
                              className="top-0 left-0 absolute bg-white/30 rounded-full h-full animate-pulse"
                              style={{
                                 width: `${result.percentage}%`,
                              }}
                           />
                        )}
                     </div>
                  </div>
               );
            })}
         </div>

         {totalVotes === 0 && (
            <div className="py-8 text-gray-500 text-center">
               <p className="text-lg">Esperando las primeras respuestas...</p>
            </div>
         )}

         <style jsx>{`
            @keyframes slideInUp {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }
         `}</style>
      </div>
   );
}
