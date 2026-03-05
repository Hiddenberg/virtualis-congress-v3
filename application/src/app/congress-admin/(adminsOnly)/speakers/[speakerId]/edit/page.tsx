import { notFound } from "next/navigation";
import SpeakerEditForm from "@/components/congress-admin/speakers/SpeakerEditForm";
import { getSpeakerById } from "@/features/users/speakers/services/speakerServices";

export default async function SpeakerEditPage({ params }: { params: Promise<{ speakerId: string }> }) {
   const { speakerId } = await params;
   const speaker = await getSpeakerById(speakerId);

   if (!speaker) {
      return notFound();
   }

   return (
      <div className="px-10 py-8">
         <SpeakerEditForm speaker={speaker} />
      </div>
   );
}
