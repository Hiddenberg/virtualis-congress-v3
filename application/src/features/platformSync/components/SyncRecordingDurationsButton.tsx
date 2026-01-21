"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { ensureAllRecordingsHaveDuration } from "../serverActions/recordingsSyncActions";

export default function SyncRecordingDurationsButton() {
   const [isLoading, startTransition] = useTransition();
   const handleSyncRecordingDurations = async () => {
      startTransition(async () => {
         const response = await ensureAllRecordingsHaveDuration();
         if (!response.success) {
            toast.error(response.errorMessage);
         } else {
            toast.success(
               `Se sincronizaron ${response.data.recordingsUpdated.length} grabaciones, las grabaciones con error fueron ${response.data.recordingsWithError.join(", ")}`,
            );
         }
      });
   };

   return (
      <div>
         <h1>Sincronizar duraciones de grabaciones</h1>

         <Button onClick={handleSyncRecordingDurations} loading={isLoading} variant="primary">
            Sincronizar duraciones de grabaciones
         </Button>
      </div>
   );
}
