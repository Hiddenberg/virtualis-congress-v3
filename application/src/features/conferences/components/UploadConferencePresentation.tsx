"use client";

import { useRouter } from "next/navigation";
import UploadPresentationForm from "@/features/pptPresentations/components/UploadPresentationForm";

export default function UploadConferencePresentation({ conferenceId }: { conferenceId: string }) {
   const router = useRouter();

   async function handlePresentationSaved({
      presentation,
   }: {
      presentation: PresentationRecord;
      presentationSlides: PresentationSlideRecord[];
   }) {
      await fetch(`/api/conferences/${conferenceId}/presentation`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            presentationId: presentation.id,
         }),
      });

      router.push(`/preparation/${conferenceId}/presentation/uploaded`);
   }

   return <UploadPresentationForm onPresentationSaved={handlePresentationSaved} />;
}
