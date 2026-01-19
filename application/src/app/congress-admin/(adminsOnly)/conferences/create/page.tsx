import { ConferenceForm } from "@/features/conferences/components/ConferenceForm";
import { getAllSpeakerNamesAndIds } from "@/features/users/speakers/services/speakerServices";

export const dynamic = "force-dynamic";

export default async function ConferencesPage() {
   const speakersAvailable = await getAllSpeakerNamesAndIds();

   return (
      <div>
         <ConferenceForm mode="create" speakersAvailable={speakersAvailable} />
      </div>
   );
}
