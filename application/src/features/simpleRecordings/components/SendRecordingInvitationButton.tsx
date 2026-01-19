"use client";

import { useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { sendRecordingInvitationEmailAction } from "../serverActions/recordingsActions";

export default function SendRecordingInvitationButton({
   recordingId,
}: {
   recordingId: string;
}) {
   const [isSendingInvitation, startTransition] = useTransition();

   return (
      <Button
         loading={isSendingInvitation}
         onClick={() =>
            startTransition(async () => {
               const response =
                  await sendRecordingInvitationEmailAction(recordingId);

               if (!response.success) {
                  alert(response.errorMessage);
               } else {
                  alert("Correo de invitación enviado");
               }
            })
         }
      >
         {isSendingInvitation
            ? "Enviando correo..."
            : "Enviar correo de invitación"}
      </Button>
   );
}
