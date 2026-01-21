"use client";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { sendRecordingReminderEmailAction } from "../serverActions/recordingsActions";

export default function SendRecordingReminderButton({ recordingId }: { recordingId: string }) {
   const [isSending, startTransition] = useTransition();

   const handleSendReminder = () => {
      startTransition(async () => {
         const response = await sendRecordingReminderEmailAction(recordingId);

         if (!response.success) {
            toast.error(response.errorMessage);
         } else {
            toast.success("Recordatorio enviado");
         }
      });
   };

   return (
      <Button onClick={handleSendReminder} disabled={isSending} loading={isSending}>
         {isSending ? "Enviando..." : "Enviar recordatorio"}
      </Button>
   );
}
