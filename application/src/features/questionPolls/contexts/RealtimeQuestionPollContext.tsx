"use client";

import type { UnsubscribeFunc } from "pocketbase";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

interface RealtimeQuestionPollContextType {
   questionPoll: QuestionPollRecord;
   questionPollOptions: QuestionPollOptionRecord[];
   questionPollAnswers: QuestionPollAnswerRecord[];
}

const realtimeQuestionPollContext = createContext<RealtimeQuestionPollContextType | null>(null);

interface RealtimeQuestionPollContextProviderProps {
   initialQuestionPoll: QuestionPollRecord;
   initialQuestionPollOptions: QuestionPollOptionRecord[];
   initialQuestionPollAnswers: QuestionPollAnswerRecord[];
   children: ReactNode;
}

export const RealtimeQuestionPollContextProvider = ({
   initialQuestionPoll,
   initialQuestionPollOptions,
   initialQuestionPollAnswers,
   children,
}: RealtimeQuestionPollContextProviderProps) => {
   const [questionPoll, setQuestionPoll] = useState<QuestionPollRecord>(initialQuestionPoll);
   const [questionPollOptions, setQuestionPollOptions] = useState<QuestionPollOptionRecord[]>(initialQuestionPollOptions);
   const [questionPollAnswers, setQuestionPollAnswers] = useState<QuestionPollAnswerRecord[]>(initialQuestionPollAnswers);

   useEffect(() => {
      let aborted = false;
      const unsubscribers: UnsubscribeFunc[] = [];

      const setRealtimeSubscriptions = async () => {
         try {
            // Subscribe to question poll record updates
            const unsubscribeQuestionPoll = await pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLLS)
               .subscribe<QuestionPollRecord>(questionPoll.id, (event) => {
                  if (event.action === "update") {
                     console.log("update question poll", event.record);
                     setQuestionPoll(event.record);
                  }
               });
            if (aborted) unsubscribeQuestionPoll();
            else unsubscribers.push(unsubscribeQuestionPoll);

            // Subscribe to question poll options updates
            const unsubscribeQuestionPollOptions = await pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLL_OPTIONS)
               .subscribe<QuestionPollOptionRecord>(
                  "*",
                  (event) => {
                     if (event.action === "update") {
                        const updatedQuestionPollOption = event.record;
                        setQuestionPollOptions((prevOptions) =>
                           prevOptions.map((option) => {
                              if (option.id === updatedQuestionPollOption.id) {
                                 return updatedQuestionPollOption;
                              }
                              return option;
                           }),
                        );
                     }
                  },
                  {
                     filter: `questionPoll = "${questionPoll.id}"`,
                  },
               );
            if (aborted) unsubscribeQuestionPollOptions();
            else unsubscribers.push(unsubscribeQuestionPollOptions);

            // Subscribe to question poll answers updates
            const unsubscribeQuestionPollAnswers = await pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLL_ANSWERS)
               .subscribe<QuestionPollAnswerRecord>(
                  "*",
                  (event) => {
                     if (event.action === "create") {
                        console.log("create question poll answer", event.record);
                        const updatedQuestionPollAnswer = event.record;
                        setQuestionPollAnswers((prevAnswers) => [...prevAnswers, updatedQuestionPollAnswer]);
                     } else if (event.action === "delete") {
                        const deletedQuestionPollAnswer = event.record;
                        setQuestionPollAnswers((prevAnswers) =>
                           prevAnswers.filter((answer) => answer.id !== deletedQuestionPollAnswer.id),
                        );
                     }
                  },
                  {
                     filter: `questionPoll = "${questionPoll.id}"`,
                  },
               );
            if (aborted) unsubscribeQuestionPollAnswers();
            else unsubscribers.push(unsubscribeQuestionPollAnswers);
         } catch (error) {
            console.error("Failed to subscribe to question poll realtime updates", error);
         }
      };

      setRealtimeSubscriptions();

      return () => {
         aborted = true;
         unsubscribers.forEach((unsubscribe) => {
            try {
               unsubscribe();
            } catch {
               console.error("Failed to unsubscribe from question poll realtime updates");
            }
         });
      };
   }, [questionPoll.id]);

   return (
      <realtimeQuestionPollContext.Provider
         value={{
            questionPoll,
            questionPollOptions,
            questionPollAnswers,
         }}
      >
         {children}
      </realtimeQuestionPollContext.Provider>
   );
};

export function useRealtimeQuestionPoll() {
   const context = useContext(realtimeQuestionPollContext);

   if (!context) {
      throw new Error("useRealtimeQuestionPoll must be used within a RealtimeQuestionPollContextProvider");
   }

   return context;
}
