import { ArrowRightIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export default async function SpeakerSlidesReplacePage({ params }: { params: Promise<{ conferenceId: string }> }) {
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

   if (speakerSlidesFiles.length === 0) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">No se encontraron slides para esta conferencia</h1>
            <LinkButton href={`/speakers/slides/${conferenceId}/upload`} variant="blue">
               Subir Presentación
               <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         </div>
      );
   }

   return <div>SpeakerSlidesReplacePage</div>;
}
