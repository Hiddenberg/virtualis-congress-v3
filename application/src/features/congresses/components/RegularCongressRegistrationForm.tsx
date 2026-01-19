"use client";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import StaggeredAuthSignupForm, {
   type NewUserFormData,
} from "@/features/staggeredAuth/components/signup/StaggeredAuthSignupForm";
import { signupAction } from "@/features/staggeredAuth/serverActions/staggeredAuthActions";
import { confirmCongressRegistrationAction } from "../serverActions/congressRegistrationActions";

export default function RegularCongressRegistrationForm() {
   const router = useRouter();

   const redirectTo = useSearchParams().get("redirectTo");

   const handleUserCreated = async (newUserData: NewUserFormData) => {
      const userCreatedResponse = await signupAction(newUserData);

      if (!userCreatedResponse.success) {
         toast.error(userCreatedResponse.errorMessage);
         return;
      }

      const response = await confirmCongressRegistrationAction(
         userCreatedResponse.data.user.id,
      );

      if (!response.success) {
         toast.error(response.errorMessage);
         return;
      }

      toast.success(response.data.successMessage);

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
