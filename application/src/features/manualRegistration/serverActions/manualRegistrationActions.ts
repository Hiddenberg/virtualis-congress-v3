"use server";

import { revalidatePath } from "next/cache";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import { sendPlatformRegistrationConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { generateRandomId } from "@/features/staggeredAuth/utils/passwordsGenerator";
import { checkIfUserExists } from "@/features/users/services/userServices";
import type { User, UserRecord } from "@/features/users/types/userTypes";
import { dbBatch } from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import {
   // fulfillManualCongressRegistration,
   searchUsersRegisteredToCurrentCongress,
} from "../services/manualRegistrationServices";

export async function searchRegisteredUsersAction(query: string): Promise<
   BackendResponse<{
      users: Array<{
         user: UserRecord;
         hasPaid: boolean;
         hasRecordings: boolean;
      }>;
   }>
> {
   try {
      const users = await searchUsersRegisteredToCurrentCongress(query);
      return {
         success: true,
         data: {
            users,
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
         errorMessage: "Error desconocido",
      };
   }
}

export interface ManualPaymentFormData {
   userId: string;
   modality?: "in-person" | "virtual";
   grantRecordingsAccess?: boolean;
   totalAmount: number;
   discount?: number;
   currency?: string;
}

export async function registerManualPaymentAction(
   _form: ManualPaymentFormData,
): Promise<BackendResponse<{ userPaymentId: string }>> {
   try {
      // const result = await fulfillManualCongressRegistration({
      //    userId: form.userId,
      //    modality: form.modality,
      //    grantRecordingsAccess: form.grantRecordingsAccess,
      //    totalAmount: form.totalAmount !== 0 ? form.totalAmount * 100 : 0, // Convert to cents
      //    discount: form.discount !== 0 ? (form.discount !== undefined ? form.discount * 100 : 0) : 0, // Convert to cents
      //    currency: form.currency,
      // });

      throw new Error("PENDING NEW IMPLEMENTATION");

      // revalidatePath("/manual-registration");
      // return {
      //    success: true,
      //    data: {
      //       userPaymentId: result.userPaymentId,
      //    },
      // };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
   }
}

export interface StaffNewUserFormData {
   name: string;
   email: string;
   phoneNumber?: string;
   dateOfBirth?: string;
   additionalEmail1?: string;
   additionalEmail2?: string;
}

export async function staffCreateAttendantUserAction(form: StaffNewUserFormData): Promise<BackendResponse<null>> {
   try {
      const exists = await checkIfUserExists(form.email);
      if (exists) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado en la plataforma",
         };
      }

      if (form.additionalEmail1) {
         const additionalEmail1Exists = await checkIfUserExists(form.additionalEmail1);
         if (additionalEmail1Exists) {
            return {
               success: false,
               errorMessage: `Este correo adicional ${form.additionalEmail1} ya está registrado en la plataforma`,
            };
         }
      }

      if (form.additionalEmail2) {
         const additionalEmail2Exists = await checkIfUserExists(form.additionalEmail2);
         if (additionalEmail2Exists) {
            return {
               success: false,
               errorMessage: `Este correo adicional ${form.additionalEmail2} ya está registrado en la plataforma`,
            };
         }
      }

      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      const batch = dbBatch();

      const newUserId = generateRandomId();
      batch.collection(PB_COLLECTIONS.USERS).create({
         id: newUserId,
         organization: organization.id,
         name: form.name,
         email: form.email,
         phoneNumber: form.phoneNumber,
         dateOfBirth: form.dateOfBirth,
         additionalEmail1: form.additionalEmail1,
         additionalEmail2: form.additionalEmail2,
         role: "attendant",
      } satisfies User & { id: string });

      // Register the user to the congress
      const userRegistrationId = generateRandomId();
      batch.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).create({
         id: userRegistrationId,
         organization: organization.id,
         user: newUserId,
         congress: congress.id,
         hasAccessToRecordings: false,
         paymentConfirmed: false,
         registrationType: "regular",
      } satisfies CongressRegistration & { id: string });

      await batch.send();

      await sendPlatformRegistrationConfirmationEmail(newUserId);

      revalidatePath("/manual-registration");

      return {
         success: true,
         data: null,
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
         errorMessage: "Ocurrió un error al crear el usuario",
      };
   }
}
