"use client";

import { LinkIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { LinkButton } from "../global/Buttons";

export default function GoToAttendantViewButton() {
   const { conferenceId } = useParams();

   if (!conferenceId) return null;

   return (
      <LinkButton
         href={`/QnA-transmission/${conferenceId}/attendant-view/QnA`}
         target="_blank"
         variant="dark"
      >
         <LinkIcon className="size-4" />
         Ver Transmisión en vivo
      </LinkButton>
   );
}
