"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SlideChangeEvent {
   slideIndex: number;
   timestamp: number;
}

interface PersistedRecordingState {
   // ms since epoch when recording started
   startedAtMs: number;
   // ordered list of slide change events relative to startedAtMs
   slideChanges: SlideChangeEvent[];
}

/**
 * Provides resilient local persistence for presentation recording timeline
 * data so users can resume after accidental tab close or network disconnects.
 */
export function useLocalPresentationRecording(presentationId: string) {
   const storageKey = useMemo(() => `vc:presentationRecording:${presentationId}`, [presentationId]);
   const isClientRef = useRef<boolean>(typeof window !== "undefined");
   const [persisted, setPersisted] = useState<PersistedRecordingState | null>(() => {
      if (!isClientRef.current) return null;
      try {
         const raw = window.localStorage.getItem(`vc:presentationRecording:${presentationId}`);
         if (!raw) return null;
         const parsed = JSON.parse(raw) as PersistedRecordingState;
         if (parsed && typeof parsed.startedAtMs === "number" && Array.isArray(parsed.slideChanges)) {
            return parsed;
         }
         return null;
      } catch {
         return null;
      }
   });
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      // Mark as loaded on first effect run; initial state already attempted a sync read
      setIsLoaded(true);
   }, []);

   const write = useCallback(
      (state: PersistedRecordingState | null) => {
         if (!isClientRef.current) return;
         try {
            if (state === null) {
               window.localStorage.removeItem(storageKey);
               setPersisted(null);
               return;
            }
            window.localStorage.setItem(storageKey, JSON.stringify(state));
            setPersisted(state);
         } catch {
            // Swallow storage errors; persistence is best-effort
         }
      },
      [storageKey],
   );

   const start = useCallback(() => {
      const now = Date.now();
      write({
         startedAtMs: now,
         slideChanges: [],
      });
   }, [write]);

   const appendSlideChange = useCallback(
      (slideIndex: number) => {
         setPersisted((prev) => {
            const base = prev ?? {
               startedAtMs: Date.now(),
               slideChanges: [] as SlideChangeEvent[],
            };
            const next: PersistedRecordingState = {
               ...base,
               slideChanges: [
                  ...base.slideChanges,
                  {
                     slideIndex,
                     timestamp: Date.now() - base.startedAtMs,
                  },
               ],
            };
            // Write through
            try {
               if (isClientRef.current) {
                  window.localStorage.setItem(storageKey, JSON.stringify(next));
               }
            } catch {}
            return next;
         });
      },
      [storageKey],
   );

   const clear = useCallback(() => {
      write(null);
   }, [write]);

   const readLatest = useCallback(() => {
      if (!isClientRef.current) return null;
      try {
         const raw = window.localStorage.getItem(storageKey);
         if (!raw) return null;
         const parsed = JSON.parse(raw) as PersistedRecordingState;
         return parsed ?? null;
      } catch {
         return null;
      }
   }, [storageKey]);

   return {
      persisted,
      isLoaded,
      start,
      appendSlideChange,
      clear,
      readLatest,
   };
}
