"use client";

import { UnlinkIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { unlinkSpeakerPresentationRecordingFromConferenceAction } from "../../actions/conferenceSpeakerPresentationRecordingActions";

export default function UnlinkSpeakerPresentationRecordingButton({
   conferenceId,
}: {
   conferenceId: CongressConferenceRecord["id"];
}) {
   const [isLoading, startTransition] = useTransition();

   const handleUnlink = () => {
      const confirmed = window.confirm("¿Desvincular la grabación actual?");
      if (!confirmed) return;
      startTransition(async () => {
         const unlinkREsponse = await unlinkSpeakerPresentationRecordingFromConferenceAction({
            conferenceId,
         });
         if (!unlinkREsponse.success) {
            toast.error(unlinkREsponse.errorMessage);
            return;
         }
         toast.success("Grabación desvinculada");
      });
   };

   return (
      <Button variant="destructive" onClick={handleUnlink} loading={isLoading} className="shrink-0">
         <UnlinkIcon className="size-4" />
         {isLoading ? "Desvinculando..." : "Desvincular grabación"}
      </Button>
   );
}
