import { ArrowRightIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import GoBackButton from "@/components/global/GoBackButton";
import LinkSpeakerPresentationRecordingForm from "@/features/conferences/components/conferenceSpeakerPresentation/LinkSpeakerPresentationRecordingForm";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getSpeakerPresentationRecordingByConferenceId } from "@/features/conferences/services/conferenceSpeakerPresentationRecordingServices";
import { getAllSimpleRecordingCampaigns } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { getAllSimpleRecordings } from "@/features/simpleRecordings/services/recordingsServices";

export default async function SpeakerPresentationRecordingLinkPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
         </div>
      );
   }

   const linkedRecording = await getSpeakerPresentationRecordingByConferenceId(conferenceId);
   if (linkedRecording) {
      return (
         <div>
            <h1>Presentación del ponente ya vinculada</h1>
            <LinkButton href={`/congress-admin/conferences/${conferenceId}/speaker-presentation-recording`} variant="blue">
               Ir a la presentación del ponente
               <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         </div>
      );
   }

   const campaigns = await getAllSimpleRecordingCampaigns();
   const allRecordings = await getAllSimpleRecordings();

   return (
      <div>
         <GoBackButton className="mb-4" />
         <p className="text-gray-600">Vincular presentación del ponente</p>
         <h1 className="font-bold text-gray-900 text-xl">Conferencia: {conference.title}</h1>

         <LinkSpeakerPresentationRecordingForm campaigns={campaigns} recordings={allRecordings} />
      </div>
   );
}
