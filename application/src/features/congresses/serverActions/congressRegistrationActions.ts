"use server";

import { sendPlatformRegistrationConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { registerUserToLatestCongress } from "../services/congressRegistrationServices";

export async function confirmCongressRegistrationAction(
   newUserId: string,
): Promise<BackendResponse<{ successMessage: string }>> {
   try {
      // Register user to latest congress
      await registerUserToLatestCongress(newUserId);

      // Send registration confirmation email
      await sendPlatformRegistrationConfirmationEmail(newUserId);

      return {
         success: true,
         data: {
            successMessage: "Usuario registrado correctamente",
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage:
            "Ocurrió un error inesperado al confirmar la registración",
      };
   }
}
