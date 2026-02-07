"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { syncCongressRecordings } from "../serverActions/recordingsSyncActions";

export default function SyncAllCongressRecordings() {
   const [isLoading, startTransition] = useTransition();
   const [result, setResult] = useState<{
      createdRecordings: string[];
      copiedRecordings: string[];
      failedRecordings: {
         conferenceId: string;
         errorMessage: string;
      }[];
      skippedRecordings: {
         conferenceId: string;
         reason: string;
      }[];
   } | null>(null);

   const handleSync = () => {
      startTransition(async () => {
         const result = await syncCongressRecordings();
         if (result.success) {
            setResult(result.data);
         } else {
            toast.error(result.errorMessage);
         }
      });
   };

   return (
      <div>
         <h1>Sync All Congress Recordings</h1>

         {result && (
            <div>
               <h2>Result</h2>
               <p>Created Recordings: {result.createdRecordings.length}</p>
               <p>Copied Recordings: {result.copiedRecordings.length}</p>
               <p>Failed Recordings: {result.failedRecordings.length}</p>
               <p>Skipped Recordings: {result.skippedRecordings.length}</p>

               <div>
                  errors
                  {result.failedRecordings.map((failedRecording) => (
                     <div key={failedRecording.conferenceId}>
                        <p>Conference ID: {failedRecording.conferenceId}</p>
                        <p>Error Message: {failedRecording.errorMessage}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}

         <Button onClick={handleSync} disabled={isLoading} loading={isLoading}>
            {isLoading ? "Syncing..." : "Sync All Congress Recordings"}
         </Button>
      </div>
   );
}
