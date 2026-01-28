"use server";

import { revalidatePath } from "next/cache";
import { registerUserToLatestCongress } from "@/features/congresses/services/congressRegistrationServices";
import { checkIfUserExists, createUser, type NewUserData } from "@/features/users/services/userServices";
import type { UserRecord } from "@/features/users/types/userTypes";
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

export async function staffCreateAttendantUserAction(form: StaffNewUserFormData): Promise<BackendResponse<{ user: UserRecord }>> {
   try {
      const exists = await checkIfUserExists(form.email);
      if (exists) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado, por favor usa otro",
         };
      }

      const newUser = await createUser({
         name: form.name,
         email: form.email,
         phoneNumber: form.phoneNumber,
         dateOfBirth: form.dateOfBirth,
         additionalEmail1: form.additionalEmail1,
         additionalEmail2: form.additionalEmail2,
         role: "attendant",
      } as NewUserData);

      await registerUserToLatestCongress(newUser.id);

      revalidatePath("/manual-registration");

      return {
         success: true,
         data: {
            user: newUser,
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
         errorMessage: "Ocurrió un error al crear el usuario",
      };
   }
}
