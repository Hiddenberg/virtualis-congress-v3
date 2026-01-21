import { ConferenceForm } from "@/features/conferences/components/ConferenceForm";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getAllSpeakerNamesAndIds } from "@/features/users/speakers/services/speakerServices";

export const dynamic = "force-dynamic";

export default async function EditConferencePage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const speakersAvailable = await getAllSpeakerNamesAndIds();
   const conference = await getConferenceById(conferenceId);
   const conferenceSpeakers = await getConferenceSpeakers(conferenceId);

   if (!conference) {
      return (
         <div>
            <h1>Conferencia no encontrada</h1>
         </div>
      );
   }

   return (
      <div>
         <ConferenceForm
            mode="edit"
            speakersAvailable={speakersAvailable}
            conference={conference ?? undefined}
            conferenceSpeakers={conferenceSpeakers}
         />
      </div>
   );
}
