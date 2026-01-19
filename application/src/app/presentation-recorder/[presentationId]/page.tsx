import PresentationRecorder from "@/features/pptPresentations/components/PresentationRecorder";
import { PresentationRecorderProvider } from "@/features/pptPresentations/contexts/PresentationRecorderContext";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";

export default async function PresentationRecorderPage({
   params,
}: {
   params: Promise<{ presentationId: string }>;
}) {
   const { presentationId } = await params;
   const presentationSlides = await getPresentationSlidesById(presentationId);
   return (
      <div className="px-6 py-6">
         <PresentationRecorderProvider presentationId={presentationId}>
            <PresentationRecorder presentationSlides={presentationSlides} />
         </PresentationRecorderProvider>
      </div>
   );
}
