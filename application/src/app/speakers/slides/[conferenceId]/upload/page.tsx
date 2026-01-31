import { redirect } from "next/navigation";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export default async function SpeakerSlidesUploadPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
         </div>
      );
   }

   const speakerSlidesFiles = await getSpeakerSlidesFilesByConferenceId(conferenceId);

   if (speakerSlidesFiles.length > 0) {
      redirect(`/speakers/slides/${conferenceId}/replace`);
   }

   return <div>UploadPresentationPage</div>;
}
