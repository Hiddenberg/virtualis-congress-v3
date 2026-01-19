"use client";

import { useTransition } from "react";
import { updateLivestreamSessionStatusAction } from "@/actions/livestreamActions";
import { Button } from "../global/Buttons";
export default function StartPreparingQnASessionButton({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const [isLoading, startTransition] = useTransition();

   const handleStartPreparingQnASession = async () => {
      startTransition(async () => {
         console.log("Starting to prepare QnA session");
         const { error } = await updateLivestreamSessionStatusAction(
            conferenceId,
            "preparing",
         );
         if (error) {
            alert(error);
         }

         window.location.reload();
      });
   };

   return (
      <Button onClick={handleStartPreparingQnASession} disabled={isLoading}>
         Preparar Sesión
      </Button>
   );
}
