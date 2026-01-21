"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

interface ZoomSessionContextType {
   sessionId: string | null;
   sessionName: string;
   sessionKey: string;
   setSessionId: (id: string | null) => void;
}

const ZoomSessionContext = createContext<ZoomSessionContextType | null>(null);

export function ZoomSessionProvider({
   sessionName,
   sessionKey,
   children,
}: {
   sessionName: string;
   sessionKey: string;
   children: ReactNode;
}) {
   const [sessionId, setSessionId] = useState<string | null>(null);

   const value = useMemo(() => {
      return {
         sessionId,
         sessionName: sessionName.toLowerCase().trim().replaceAll(" ", "-").substring(0, 50),
         sessionKey,
         setSessionId,
      };
   }, [sessionId, sessionName, sessionKey]);

   return <ZoomSessionContext.Provider value={value}>{children}</ZoomSessionContext.Provider>;
}

export const useZoomSession = () => {
   const context = useContext(ZoomSessionContext);

   if (!context) {
      throw new Error("useZoomSession must be used within a ZoomSessionProvider");
   }

   return context;
};
