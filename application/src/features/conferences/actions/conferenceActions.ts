"use server";

import { revalidatePath } from "next/cache";
import {
   createConference,
   deleteConferenceRecord,
   type NewConferenceData,
   updateConference,
} from "@/features/conferences/services/conferenceServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import { deleteAllVideoAssetsForRecording } from "@/services/videoAssetsServices";
import type { CongressConferenceRecord } from "../types/conferenceTypes";

export async function createConferenceAction(
   newConferenceData: NewConferenceData,
): Promise<BackendResponse<CongressConferenceRecord>> {
   console.log("createNewConferenceAction", newConferenceData);
   const isAuthorizedUser = checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      const newConference = await createConference(newConferenceData);

      revalidatePath("/congress-admin/conferences", "layout");
      return {
         success: true,
         data: newConference,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error(error);
      return {
         success: false,
         errorMessage: "[createConferenceAction] An unknown error occurred",
      };
   }
}

export interface ConferenceFormData {
   title: string;
   shortDescription: string;
   startTime: string;
   endTime: string;
   speakerIds: string[];
   conferenceType: "individual" | "group";
   status: "scheduled" | "recorded" | "live" | "finished" | "canceled";
   presenter?: string;
}

export async function updateConferenceAction({
   conferenceId,
   newConferenceData,
}: {
   conferenceId: string;
   newConferenceData: Partial<NewConferenceData>;
}): Promise<BackendResponse<CongressConferenceRecord>> {
   const isAuthorizedUser = checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      const updatedConference = await updateConference(conferenceId, newConferenceData);
      return {
         success: true,
         data: updatedConference,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error(error);
      return {
         success: false,
         errorMessage: "[updateConferenceAction] An unknown error occurred",
      };
   }
}

export async function deleteAllVideoAssetsForRecordingAction(recordingId: string) {
   const isAuthorizedUser = checkAuthorizedUserFromServer(["admin", "super_admin"]);

   if (!isAuthorizedUser) {
      return {
         error: "Unauthorized user",
      };
   }

   try {
      await deleteAllVideoAssetsForRecording(recordingId);
      revalidatePath(`/congress-admin/conference-calendar/[conferenceDate]`, "layout");
      return {
         success: true,
      };
   } catch (error) {
      const err = error as Error;
      return {
         error: err.message,
      };
   }
}

export async function deleteConferenceAction(conferenceId: string): Promise<BackendResponse<null>> {
   const isAuthorizedUser = checkAuthorizedUserFromServer(["super_admin", "admin"]);

   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      await deleteConferenceRecord(conferenceId);
      revalidatePath("/congress-admin/conference-calendar/[conferenceDate]", "layout");
      revalidatePath("/congress-admin/conferences", "layout");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      const err = error as Error;
      return {
         success: false,
         errorMessage: err.message,
      };
   }
}
