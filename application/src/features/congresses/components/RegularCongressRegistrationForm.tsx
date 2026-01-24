"use client";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import StaggeredAuthSignupForm, {
   type NewUserFormData,
} from "@/features/staggeredAuth/components/signup/StaggeredAuthSignupForm";
import { signupToCongressAction } from "@/features/staggeredAuth/serverActions/staggeredAuthActions";

export default function RegularCongressRegistrationForm() {
   const router = useRouter();

   const redirectTo = useSearchParams().get("redirectTo");

   const handleUserCreated = async (newUserData: NewUserFormData) => {
      const signedUpResponse = await signupToCongressAction(newUserData);

      if (!signedUpResponse.success) {
         toast.error(signedUpResponse.errorMessage);
         return;
      }

      toast.success("Usuario registrado correctamente");

      if (redirectTo) {
         router.push(redirectTo);
      } else {
         router.push(`/registration-confirmed`);
      }
   };

   return (
      <div>
         <StaggeredAuthSignupForm onSubmit={handleUserCreated} />
      </div>
   );
}
