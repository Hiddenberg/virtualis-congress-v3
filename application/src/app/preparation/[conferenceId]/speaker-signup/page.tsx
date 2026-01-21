import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import SpeakerSelfRegistrationForm from "@/features/users/speakers/components/SpeakerRegistrationForm";

export default async function SpeakerSignupPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conferenceSpeakers = await getConferenceSpeakers(conferenceId);

   if (conferenceSpeakers.length === 0) {
      return <div>No hay conferencistas asignados a esta conferencia</div>;
   }

   const speakerData = conferenceSpeakers[0];

   return (
      <div>
         <SpeakerSelfRegistrationForm conferenceId={conferenceId} speakerData={speakerData} />
      </div>
   );
}
