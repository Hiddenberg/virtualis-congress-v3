"use client";

import { createContext, useContext } from "react";
import { useRealtimeLivestreamStatus } from "../customHooks/useRealtimeLivestreamStatus";

const RealtimeLivestreamStatusContext = createContext<ReturnType<typeof useRealtimeLivestreamStatus> | null>(null);

export function RealtimeLivestreamStatusProvider({
   children,
   livestreamSession,
}: {
   children: React.ReactNode;
   livestreamSession: LivestreamSessionRecord;
}) {
   const livestreamStatus = useRealtimeLivestreamStatus({
      livestreamSession,
   });

   return (
      <RealtimeLivestreamStatusContext.Provider value={livestreamStatus}>{children}</RealtimeLivestreamStatusContext.Provider>
   );
}

export function useRealtimeLivestreamStatusContext() {
   const context = useContext(RealtimeLivestreamStatusContext);
   if (!context) {
      throw new Error("useRealtimeLivestreamStatusContext must be used within a RealtimeLivestreamStatusProvider");
   }
   return context;
}
