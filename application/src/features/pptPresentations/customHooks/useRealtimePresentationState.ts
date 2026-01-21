"use client";

import { useCallback, useEffect, useState } from "react";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export function useRealtimePresentationState(presentationId: string) {
   const [state, setState] = useState<RealtimePresentationStateRecord | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      if (!presentationId) return;

      let unsubscribe: (() => void) | undefined;
      let aborted = false;

      const setup = async () => {
         setIsLoading(true);
         try {
            // Ensure current state via API
            const res = await fetch(`/api/presentation/${presentationId}/realtime-state`, {
               cache: "no-store",
            });
            if (!res.ok) {
               throw new Error(`Error fetching realtime state (${res.status})`);
            }
            const initial: RealtimePresentationStateRecord = await res.json();
            if (!aborted) setState(initial);

            // Subscribe to realtime updates of the single record
            const collection = pbClient.collection(PB_COLLECTIONS.PRESENTATION_REALTIME_STATES);
            const unsub = initial?.id
               ? await collection.subscribe<RealtimePresentationStateRecord>(initial.id, (event) => {
                    if (event.action === "update") setState(event.record);
                 })
               : await collection.subscribe<RealtimePresentationStateRecord>(
                    "*",
                    (event) => {
                       if (event.action === "update") setState(event.record);
                    },
                    {
                       filter: `presentation = "${presentationId}"`,
                    },
                 );
            if (!aborted) unsubscribe = unsub;
         } finally {
            if (!aborted) setIsLoading(false);
         }
      };

      setup();

      return () => {
         aborted = true;
         if (unsubscribe) unsubscribe();
      };
   }, [presentationId]);

   const updateState = useCallback(
      async (updates: Partial<Pick<RealtimePresentationState, "currentSlideIndex" | "isHidden" | "userControlling">>) => {
         if (!presentationId) return;
         fetch(`/api/presentation/${presentationId}/realtime-state`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
         });
      },
      [presentationId],
   );

   return {
      state,
      isLoading,
      updateState,
   };
}
