"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StaggeredAuthSignupForm, {
   type NewUserFormData,
} from "@/features/staggeredAuth/components/signup/StaggeredAuthSignupForm";
import type { SpeakerDataRecord } from "@/types/congress";
import { registerSpeakerUserAction } from "../serverActions/speakerActions";

export default function SpeakerSelfRegistrationForm({
   conferenceId,
   speakerData,
}: {
   conferenceId: string;
   speakerData: SpeakerDataRecord;
}) {
   const router = useRouter();

   const handleUserCreated = async (newUserFormData: NewUserFormData) => {
      const response = await registerSpeakerUserAction(
         newUserFormData,
         speakerData,
      );

      if (!response.success) {
         toast.error(response.errorMessage);
         return;
      }

      toast.success(response.data.successMessage);
      router.push(`/preparation/${conferenceId}/presentation/upload`);
   };

   return (
      <div>
         <StaggeredAuthSignupForm
            onSubmit={handleUserCreated}
            welcomeMessage={`Bienvenido ${speakerData.academicTitle} ${speakerData.displayName}`}
            welcomeDescription={`Por favor completa tu registro como conferencista para poder subir tu presentación`}
         />
      </div>
   );
}
