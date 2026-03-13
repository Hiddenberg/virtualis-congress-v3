"use server";

import { revalidatePath } from "next/cache";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import {
   createConferenceRoomRecord,
   deleteConferenceRoomRecord,
   updateConferenceRoomRecord,
} from "../services/conferenceRoomsServices";
import type { ConferenceRoom, ConferenceRoomRecord, NewConferenceRoomData } from "../types/conferenceRoomsTypes";

export async function createConferenceRoomAction(
   newConferenceRoomData: NewConferenceRoomData,
): Promise<BackendResponse<ConferenceRoomRecord>> {
   const isAuthorizedUser = await checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      const congress = await getLatestCongress();
      const newConferenceRoom = await createConferenceRoomRecord({
         newConferenceRoomData,
         congressId: congress.id,
      });

      revalidatePath("/congress-admin");
      revalidatePath("/congress-admin/conference-rooms", "layout");

      return {
         success: true,
         data: newConferenceRoom,
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
         errorMessage: "[createConferenceRoomAction] An unknown error occurred",
      };
   }
}

export async function updateConferenceRoomAction({
   conferenceRoomId,
   newConferenceRoomData,
}: {
   conferenceRoomId: string;
   newConferenceRoomData: Partial<ConferenceRoom>;
}): Promise<BackendResponse<ConferenceRoomRecord>> {
   const isAuthorizedUser = await checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      const updatedConferenceRoom = await updateConferenceRoomRecord(conferenceRoomId, newConferenceRoomData);

      revalidatePath("/congress-admin/conference-rooms", "layout");
      revalidatePath(`/congress-admin/conference-rooms/${conferenceRoomId}/edit`);

      return {
         success: true,
         data: updatedConferenceRoom,
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
         errorMessage: "[updateConferenceRoomAction] An unknown error occurred",
      };
   }
}

export async function deleteConferenceRoomAction(conferenceRoomId: string): Promise<BackendResponse<null>> {
   const isAuthorizedUser = await checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      await deleteConferenceRoomRecord(conferenceRoomId);

      revalidatePath("/congress-admin/conference-rooms", "layout");
      revalidatePath("/congress-admin");

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
         errorMessage: "[deleteConferenceRoomAction] An unknown error occurred",
      };
   }
}
