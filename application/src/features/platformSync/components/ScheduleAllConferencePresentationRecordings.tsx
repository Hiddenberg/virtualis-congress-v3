"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import {
   ScheduleAllConferenceRecordingsResult,
   scheduleAllConferencePresentationRecordingsAction,
} from "../serverActions/recordingsSyncActions";

export default function ScheduleAllConferencePresentationRecordings() {
   const [isLoading, startTransition] = useTransition();
   const [result, setResult] =
      useState<ScheduleAllConferenceRecordingsResult | null>(null);

   const handleSchedule = () => {
      startTransition(async () => {
         const result =
            await scheduleAllConferencePresentationRecordingsAction();

         if (result.success) {
            setResult(result.data);
         } else {
            toast.error(result.errorMessage);
         }
      });
   };

   return (
      <div>
         <h1>Schedule All Conference Presentation Recordings</h1>

         {result && (
            <div>
               <h2>Result</h2>
               <p>Created Recordings: {result.createdRecordings.length}</p>
               <p>Skipped Recordings: {result.skippedRecordings.length}</p>
               <p>Failed Recordings: {result.failedRecordings.length}</p>
            </div>
         )}

         <Button
            onClick={handleSchedule}
            disabled={isLoading}
            loading={isLoading}
         >
            Schedule All Conference Presentation Recordings
         </Button>
      </div>
   );
}
