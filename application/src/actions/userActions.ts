"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ClientResponseError, type RecordModel } from "pocketbase";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import {
   createUser,
   getUserByEmail,
   getUserById,
} from "@/features/users/services/userServices";
import pbServerClient from "@/libs/pbServerClient";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import { getIpInfoFromHeaders } from "@/services/ipServices";
import { getExpandedRecordingById } from "@/services/recordingServices";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export async function getUserIpInfoAction() {
   const ipInfoResponse = await getIpInfoFromHeaders();

   return ipInfoResponse;
}

export async function createNewCoordinatorUserAction({
   coordinatorName,
   coordinatorEmail,
}: {
   coordinatorName: string;
   coordinatorEmail: string;
}) {
   try {
      const isUserAuthorized = await checkAuthorizedUserFromServer([
         "admin",
         "super_admin",
      ]);

      if (!isUserAuthorized) {
         return {
            error: "No tienes permisos para registrar un nuevo usuario",
         };
      }

      const existingUser = await getUserByEmail(coordinatorEmail);
      if (existingUser) {
         return {
            error: "El correo electrónico ya está registrado",
         };
      }

      await createUser({
         name: coordinatorName,
         email: coordinatorEmail,
         role: "coordinator",
      });

      revalidatePath("/congress-admin/coordinators");
      return {
         success: true,
         message: `El coordinador ${coordinatorName} ha sido creado correctamente`,
      };
   } catch (error) {
      const err = error as Error;
      return {
         error: err.message,
      };
   }
}

export async function setTokenCookieAction(token: string) {
   const cookieStore = await cookies();
   cookieStore.set("authToken", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31 * 2), // 2 months
      httpOnly: true,
   });
}

export async function removeTokenCookieAction() {
   const cookieStore = await cookies();
   cookieStore.delete("authToken");
}

export async function confirmUserPaymentAction() {
   try {
      const userId = await getLoggedInUserId();
      const user = await getUserById(userId ?? "");

      if (!user) {
         console.error(
            `[User Actions] User not found for token ${userId} while confirming payment`,
         );
         return false;
      }

      // If the user is not a regular attendant, check if they have a payment since they usually don't have a registration
      if (user.role !== "attendant") {
         try {
            console.log(
               `[User Actions] User ${user.id} is not an attendant, checking for payment directly`,
            );
            const userPayment = await pbServerClient
               .collection(PB_COLLECTIONS.USER_PAYMENTS)
               .getFirstListItem<RecordModel & UserPayment>(
                  `user = "${user.id}"`,
               );

            if (userPayment) {
               console.log(
                  `[User Actions] User ${user.id} has a payment, allowing access`,
               );
               return true;
            }
         } catch (error) {
            if (error instanceof ClientResponseError && error.status === 404) {
               console.log(
                  `[User Actions] User ${user.id} does not have a payment, denying access`,
               );
               return false;
            }
            throw error;
         }
      }

      // If the user is an attendant, check if they have a registration
      console.log(
         `[User Actions] User ${user.id} is an attendant, checking for registration`,
      );
      const userRegistration = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS)
         .getFirstListItem<RecordModel & CongressRegistration>(
            `userRegistered = "${user.id}"`,
         );

      if (userRegistration.paymentConfirmed) {
         console.log(
            `[User Actions] User ${user.id} has a registration AND payment confirmed, allowing access`,
         );
         return true;
      }
      console.log(
         `[User Actions] User ${user.id} does not have a payment confirmed, denying access`,
      );
      return false;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return false;
      }
      throw error;
   }
}

export async function checkExistingUserAction(email: string) {
   const existingUser = await getUserByEmail(email);

   if (existingUser) {
      return true;
   }

   return false;
}

export async function getSpeakerEmailByRecordingIdAction(recordingId: string) {
   const expandedRecording = await getExpandedRecordingById(recordingId);

   if (!expandedRecording) {
      return "";
   }

   const speakerEmail =
      expandedRecording.expand.usersWhoWillRecord?.[0].email || "";

   return speakerEmail;
}
