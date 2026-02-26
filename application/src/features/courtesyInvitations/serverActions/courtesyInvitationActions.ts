"use server";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   createSingleCourtesyInvitationAndSendEmail,
   generateMultipleCourtesyInvitationCodes,
} from "../services/courtesyInvitationServices";

const MAX_QUANTITY_PER_REQUEST = 50;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createCourtesyInvitationsAction(quantity: number): Promise<BackendResponse<{ createdCount: number }>> {
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

export async function createSingleCourtesyInvitationAndSendEmailAction({
   email,
   recipientName,
}: {
   email: string;
   recipientName?: string;
}): Promise<BackendResponse<{ invitationId: string }>> {
   try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
         return {
            success: false,
            errorMessage: "El correo electrónico es requerido",
         };
      }

      if (!emailRegex.test(trimmedEmail)) {
         return {
            success: false,
            errorMessage: "El correo electrónico no es válido",
         };
      }

      const courtesyInvitation = await createSingleCourtesyInvitationAndSendEmail({
         email: trimmedEmail,
         recipientName: recipientName?.trim() || undefined,
      });

      return {
         success: true,
         data: { invitationId: courtesyInvitation.id },
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
         errorMessage: "Error al crear y enviar la invitación de cortesía",
      };
   }
}
