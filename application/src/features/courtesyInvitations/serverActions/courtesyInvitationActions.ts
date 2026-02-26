"use server";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { generateMultipleCourtesyInvitationCodes } from "../services/courtesyInvitationServices";

const MAX_QUANTITY_PER_REQUEST = 50;

export async function createCourtesyInvitationsAction(
   quantity: number,
): Promise<BackendResponse<{ createdCount: number }>> {
   try {
      if (quantity < 1 || quantity > MAX_QUANTITY_PER_REQUEST) {
         return {
            success: false,
            errorMessage: `La cantidad debe estar entre 1 y ${MAX_QUANTITY_PER_REQUEST}`,
         };
      }

      const congress = await getLatestCongress();
      await generateMultipleCourtesyInvitationCodes(congress.id, quantity);

      return {
         success: true,
         data: { createdCount: quantity },
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
         errorMessage: "Error al crear las invitaciones de cortesía",
      };
   }
}
