import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export default async function SpeakerSlidesFilesPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return <div>Conferencia no encontrada</div>;
   }

   const speakerSlidesFiles = await getSpeakerSlidesFilesByConferenceId(conferenceId);

   return <div>SpeakerSlidesFilesPage</div>;
}
