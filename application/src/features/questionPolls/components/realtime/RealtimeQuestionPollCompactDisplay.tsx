"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeQuestionPoll } from "../../contexts/RealtimeQuestionPollContext";

export default function RealtimeQuestionPollCompactDisplay() {
   const { questionPoll, questionPollOptions, questionPollAnswers } =
      useRealtimeQuestionPoll();

   const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>(
      {},
   );
   const countsRef = useRef<Record<string, number>>({});

   const total = questionPollAnswers.length;

   const results = useMemo(() => {
      const map = new Map<string, number>();
      questionPollOptions.forEach((o) => map.set(o.id, 0));
      questionPollAnswers.forEach((a) =>
         map.set(a.optionSelected, (map.get(a.optionSelected) ?? 0) + 1),
      );

      return questionPollOptions.map((o) => {
         const votes = map.get(o.id) ?? 0;
         const pct = total === 0 ? 0 : Math.round((votes / total) * 100);
         return {
            option: o,
            votes,
            pct,
         };
      });
   }, [questionPollOptions, questionPollAnswers, total]);

   // small, quick animation for numbers
   useEffect(() => {
      const targets = Object.fromEntries(
         results.map((r) => [r.option.id, r.votes]),
      );
      const start = {
         ...countsRef.current,
      };
      const t0 = Date.now();
      const dur = 400;
      const frame = () => {
         const p = Math.min((Date.now() - t0) / dur, 1);
         const ease = 1 - Math.pow(1 - p, 3);
         const next: Record<string, number> = {};
         Object.keys(targets).forEach((id) => {
            const s = start[id] ?? 0;
            const tgt = targets[id];
            next[id] = Math.round(s + (tgt - s) * ease);
         });
         setAnimatedCounts(next);
         countsRef.current = next;
         if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
   }, [results]);

   if (!questionPoll) {
      return (
         <div className="bg-white/70 shadow-sm p-4 border border-slate-300 rounded-2xl">
            <div className="flex justify-center items-center py-2">
               <span className="font-bold text-slate-500 text-base">
                  No hay encuesta activa
               </span>
            </div>
         </div>
      );
   }

   return (
      <section className="bg-white/80 shadow-sm p-4 border border-slate-300 rounded-2xl">
         <div className="">
            <div className="flex justify-between items-start gap-3 mb-2">
               <h3
                  className="flex-1 font-semibold text-slate-900 text-base line-clamp-2"
                  title={questionPoll.question}
               >
                  {questionPoll.question}
               </h3>
               <div className="flex flex-shrink-0 items-center gap-1 bg-blue-50/80 px-2 py-1 border border-blue-200/50 rounded-full">
                  <div className="bg-blue-500 rounded-full w-2 h-2 animate-pulse" />
                  <span className="font-medium text-blue-700 text-xs">
                     En vivo
                  </span>
               </div>
            </div>
            <p className="font-medium text-slate-600 text-xs">
               {total} respuesta{total !== 1 ? "s" : ""} · Actualizado en tiempo
               real
            </p>
         </div>

         <ul className="space-y-3">
            {results.map((r) => (
               <li key={r.option.id} className="group">
                  <div className="flex justify-between items-center">
                     <span
                        className="flex-1 font-bold text-slate-800 text-base truncate"
                        title={r.option.text}
                     >
                        {r.option.text}
                     </span>
                     <div className="flex items-center gap-2 ml-3 font-semibold text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                           {animatedCounts[r.option.id] ?? 0}
                        </span>
                        <span className="font-bold tabular-nums text-blue-600">
                           {r.pct}%
                        </span>
                     </div>
                  </div>
                  <div className="bg-slate-200/80 shadow-inner rounded-full h-2.5 overflow-hidden">
                     <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm rounded-full h-full transition-all duration-500 ease-out"
                        style={{
                           width: `${r.pct}%`,
                        }}
                     />
                  </div>
               </li>
            ))}
         </ul>
      </section>
   );
}
