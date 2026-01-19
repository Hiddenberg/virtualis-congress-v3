"use server";

import { createCongressCertificate } from "@/features/certificates/services/certificateServices";
import { getUserById } from "@/features/users/services/userServices";

export async function createCongressCertificateAction(
   userId: string,
   displayName: string,
) {
   try {
      console.log(
         "[Congress Certificate Actions] Creating congress certificate for user",
         userId,
      );
      const user = await getUserById(userId);
      if (!user) {
         console.error("[Congress Certificate Actions] User not found", userId);
         return {
            success: false,
            error: "User not found",
         };
      }

      // const wasSpeaker = await checkIfUserWasSpeaker(userId)
      // const wasCoordinator = await checkIfUserWasCoordinator(userId)

      // if (wasSpeaker) {
      //    await createCongressCertificate(userId, displayName, "speaker")
      //    console.log("[Congress Certificate Actions] User was speaker, creating speaker certificate", userId)
      // }

      // if (wasCoordinator) {
      //    await createCongressCertificate(userId, displayName, "coordinator")
      //    console.log("[Congress Certificate Actions] User was coordinator, creating coordinator certificate", userId)
      // }

      await createCongressCertificate(userId, displayName, "attendee");
      console.log(
         "[Congress Certificate Actions] User was attendee, creating attendee certificate",
         userId,
      );
      return {
         success: true,
         message: "Certificados creados correctamente",
      };
   } catch (error) {
      console.error(
         "[Congress Certificate] Error creating congress certificate",
         error,
      );
      return {
         success: false,
         error: "Error creating congress certificate",
      };
   }
}
