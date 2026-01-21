import { ClientResponseError, type RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import { getUserById } from "@/features/users/services/userServices";

async function getCongressRegistration(userId: string, congressId: string) {
   try {
      const filter = `userRegistered = "${userId}" && congress = "${congressId}"`;
      const congressRegistration = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS)
         .getFirstListItem<CongressRegistration & RecordModel>(filter);

      return congressRegistration;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function createNewCongressRegistration(userId: string) {
   const newCongressRegistrationData: CongressRegistration = {
      organization: TEMP_CONSTANTS.ORGANIZATION_ID,
      congress: TEMP_CONSTANTS.CONGRESS_ID,
      user: userId,
      paymentConfirmed: false,
      registrationType: "regular",
      hasAccessToRecordings: false,
   };

   const newCongressRegistration = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS)
      .create<CongressRegistration & RecordModel>(newCongressRegistrationData);

   return newCongressRegistration;
}

export async function confirmUserRegistrationPayment(userId: string, congressId: string, paymentId: string) {
   const user = await getUserById(userId);

   if (!user) {
      console.error(`[User Registration Services] No se encontró el usuario ${userId}`);
      throw new Error("User not found");
   }

   let registration;
   if (user.role !== "attendant") {
      console.log(`[User Registration Services] User ${userId} has ${user.role} role, checking for previoius registrations`);
      registration = await getCongressRegistration(userId, congressId);

      if (!registration) {
         console.log(`[User Registration Services] No previous registration found for user ${userId}, creating new one`);
         registration = await createNewCongressRegistration(userId);
      }
   } else {
      console.log(`[User Registration Services] User ${userId} is an attendant, checking for previous registrations`);
      registration = await getCongressRegistration(userId, congressId);

      if (!registration) {
         console.error(`[User Registration Services] No previous registration found for user ${userId}, creating new one`);
         registration = await createNewCongressRegistration(userId);
      }
   }

   await pbServerClient.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).update(registration.id, {
      paymentConfirmed: true,
      payment: paymentId,
   } as Partial<CongressRegistration>);
}

export async function setRegistrationAsCourtesyGuest(userId: string, congressId: string) {
   const registrationId = await getCongressRegistration(userId, congressId);

   if (!registrationId) {
      console.error("No se encontró la congress registration");
      throw new Error("Congress registration not found");
   }

   await pbServerClient.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).update(registrationId.id, {
      registrationType: "courtesy",
   });
}
