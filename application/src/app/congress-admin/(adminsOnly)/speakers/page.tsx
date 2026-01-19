import SpeakerListHeader from "@/components/congress-admin/speakers/SpeakerListHeader";
import { SpeakersTable } from "@/components/congress-admin/speakers/SpeakersTable";
import { getAllSpeakersDetails } from "@/features/users/speakers/services/speakerServices";

export const dynamic = "force-dynamic";

export default async function SpeakersPage() {
   const speakers = await getAllSpeakersDetails();
   return (
      <div className="px-10">
         <SpeakerListHeader />

         <SpeakersTable speakers={speakers} searchable={true} />
      </div>
   );
}
