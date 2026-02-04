"use client";

import type { UnsubscribeFunc } from "pocketbase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import type { CongressInPersonState, CongressInPersonStateRecord } from "../types/congressInPersonState";

export function useRealtimeCongressInPersonState({ congressId }: { congressId: CongressRecord["id"] }) {
   const [isLoading, setIsLoading] = useState(true);
   const [congressInPersonState, setCongressInPersonState] = useState<CongressInPersonState | null>(null);

   useEffect(() => {
      const getInitialInPersonState = async () => {
         try {
            const filter = pbClient.filter(
               `
               congress = {:congressId}
               `,
               {
                  congressId,
               },
            );
            const inPersonState = await pbClient
               .collection(PB_COLLECTIONS.CONGRESS_IN_PERSON_STATE)
               .getFirstListItem<CongressInPersonStateRecord>(filter);
            setCongressInPersonState(inPersonState);

            return inPersonState;
         } catch (error) {
            if (error instanceof Error) {
               toast.error(error.message);
            } else {
               toast.error("Error al obtener el estado de la conferencia");
            }
         }
      };

      let unsub: UnsubscribeFunc | undefined;

      const setUpRealtimeSubscription = async () => {
         try {
            const inPersonState = await getInitialInPersonState();

            if (!inPersonState) return;

            unsub = await pbClient
               .collection(PB_COLLECTIONS.CONGRESS_IN_PERSON_STATE)
               .subscribe<CongressInPersonStateRecord>(inPersonState.id, (event) => {
                  if (event.action === "update") {
                     setCongressInPersonState(event.record);
                  }
               });

            return unsub;
         } catch (error) {
            if (error instanceof Error) {
               toast.error(error.message);
            } else {
               toast.error("Error al obtener el estado de la conferencia");
            }
         } finally {
            setIsLoading(false);
         }
      };

      setUpRealtimeSubscription();

      return () => {
         if (unsub) {
            unsub();
         }
      };
   }, [congressId]);

   return {
      congressInPersonState,
      isLoading,
   };
}
