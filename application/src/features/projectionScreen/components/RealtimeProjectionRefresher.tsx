"use client";

import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { useRealtimeCongressInPersonState } from "@/features/congressInPersonState/customHooks/congressInPersonStateHooks";

export default function RealtimeProjectionRefresher({ congressId }: { congressId: CongressRecord["id"] }) {
   const { congressInPersonState, isLoading } = useRealtimeCongressInPersonState({ congressId });
   return (
      <div>
         <h1>Realtime Projection Refresher</h1>

         {isLoading ? (
            <div>Loading...</div>
         ) : (
            <div>
               <h2>Congress In Person State</h2>
               <pre>{JSON.stringify(congressInPersonState, null, 2)}</pre>
            </div>
         )}
      </div>
   );
}
