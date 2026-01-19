"use client";
import { useEffect, useState } from "react";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export function useRealtimeLivestreamStatus({
   livestreamSession,
}: {
   livestreamSession: LivestreamSessionRecord;
}) {
   const [livestreamStatus, setLivestreamStatus] = useState<
      LivestreamSession["status"]
   >(livestreamSession.status);
   const [attendantStatus, setAttendantStatus] = useState<
      LivestreamSession["attendantStatus"]
   >(livestreamSession.attendantStatus);

   useEffect(() => {
      let unsubscribe: (() => void) | undefined;

      const setupRealtimeSubscription = async () => {
         unsubscribe = await pbClient
            .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
            .subscribe<LivestreamSessionRecord>(
               livestreamSession.id,
               (event) => {
                  console.log(event);

                  if (event.action === "update") {
                     console.log("event.record", event.record);
                     const updatedSession = event.record;
                     setLivestreamStatus(updatedSession.status);
                     setAttendantStatus(updatedSession.attendantStatus);
                  }
               },
            );
      };

      setupRealtimeSubscription();

      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, [livestreamSession.id]);

   return {
      livestreamStatus,
      attendantStatus,
      livestreamSession,
   };
}
