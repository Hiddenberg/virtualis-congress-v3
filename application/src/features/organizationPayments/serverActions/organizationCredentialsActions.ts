"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";
import {
   createOrganizationStripeCredentials,
   deleteOrganizationStripeCredentials,
} from "../services/organizationStripeCredentialsServices";

export async function createOrganizationCredentialsAction(
   credentials: NewOrganizationStripeCredentialsData,
): Promise<BackendResponse<null>> {
   try {
      const userId = await getLoggedInUserId();
      const user = await getUserById(userId ?? "");

      if (!user) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }

      if (user.role !== "super_admin") {
         return {
            success: false,
            errorMessage: "You are not authorized to create organization credentials",
         };
      }

      await createOrganizationStripeCredentials(credentials);
      revalidatePath("/congress-admin/stripe-credentials");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         console.error(error);
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error(error);
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function deleteOrganizationCredentialsAction(credentialsId: string): Promise<BackendResponse<null>> {
   try {
      await deleteOrganizationStripeCredentials(credentialsId);
      revalidatePath("/congress-admin/stripe-credentials");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         console.error(error);
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error(error);
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}
