"use client";

import { useEffect, useRef } from "react";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { useRealtimeCongressInPersonState } from "@/features/congressInPersonState/customHooks/congressInPersonStateHooks";

export default function RealtimeProjectionRefresher({ congressId }: { congressId: CongressRecord["id"] }) {
   const { congressInPersonState, isLoading } = useRealtimeCongressInPersonState({ congressId });
   const previousStateRef = useRef<typeof congressInPersonState>(null);
   const hasInitializedRef = useRef(false);

   useEffect(() => {
      if (isLoading) return;

      // Skip reload on initial load
      if (!hasInitializedRef.current) {
         hasInitializedRef.current = true;
         previousStateRef.current = congressInPersonState;
         return;
      }

      // Reload if state has changed
      if (previousStateRef.current !== null && congressInPersonState !== null) {
         const previousStateString = JSON.stringify(previousStateRef.current);
         const currentStateString = JSON.stringify(congressInPersonState);

         if (previousStateString !== currentStateString) {
            window.location.reload();
         }
      }

      previousStateRef.current = congressInPersonState;
   }, [congressInPersonState, isLoading]);

   return <div></div>;
}
