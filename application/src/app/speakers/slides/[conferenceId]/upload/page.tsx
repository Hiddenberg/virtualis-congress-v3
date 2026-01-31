import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { SpeakerSlidesUploadForm } from "@/features/speakerSlidesV2/components/SpeakerSlidesUploadForm";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

function getSpeakerDisplayName(speaker: { displayName: string; academicTitle?: string }) {
   if (speaker.academicTitle) {
      return `${speaker.academicTitle} ${speaker.displayName}`;
   }
   return speaker.displayName;
}

export default async function SpeakerSlidesUploadPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const [conference, congress, speakers] = await Promise.all([
      getConferenceById(conferenceId),
      getLatestCongress(),
      getConferenceSpeakers(conferenceId),
   ]);

   if (!conference) {
      return (
         <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="mx-auto max-w-4xl">
               <div className="bg-white p-6 border border-gray-200 rounded-xl">
                  <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
               </div>
            </div>
         </div>
      );
   }

   const speakerSlidesFiles = await getSpeakerSlidesFilesByConferenceId(conferenceId);

   if (speakerSlidesFiles.length > 0) {
      redirect(`/speakers/slides/${conferenceId}/replace`);
   }

   const speakerNames = speakers.map((speaker) => getSpeakerDisplayName(speaker));

   return (
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
         <div className="mx-auto max-w-4xl">
            <LinkButton
               href="/speakers/slides"
               variant="secondary"
               className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               Volver a la lista de conferencias
            </LinkButton>

            <SpeakerSlidesUploadForm
               conferenceId={conferenceId}
               conferenceTitle={conference.title}
               congressTitle={congress.title}
               speakerNames={speakerNames}
            />
         </div>
      </div>
   );
}
