"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

interface ConferenceCountdownContextType {
   isFinished: boolean;
   setIsFinished: (value: boolean) => void;
}

const ConferenceCountdownContext = createContext<ConferenceCountdownContextType | null>(null);

export function ConferenceCountdownProvider({ children }: { children: ReactNode }) {
   const [isFinished, setIsFinished] = useState(false);

   const value = useMemo(() => {
      return {
         isFinished,
         setIsFinished,
      };
   }, [isFinished]);

   return <ConferenceCountdownContext.Provider value={value}>{children}</ConferenceCountdownContext.Provider>;
}

export const useConferenceCountdownContext = () => {
   return useContext(ConferenceCountdownContext);
};
