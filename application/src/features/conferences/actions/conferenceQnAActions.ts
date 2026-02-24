"use server";

import { revalidatePath } from "next/cache";
import {
   ensureConferenceQnASession,
   removeConferenceQnASession,
} from "@/features/conferences/services/conferenceQnASessionsServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import type { CongressConferenceRecord } from "../types/conferenceTypes";

export async function enableConferenceQnAAction({
   conferenceId,
}: {
   conferenceId: CongressConferenceRecord["id"];
}): Promise<BackendResponse<{ livestreamSession: LivestreamSessionRecord }>> {
   const isAuthorized = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorized) {
      return {
         success: false,
         errorMessage: "Usuario no autorizado",
      };
   }

   try {
      const session = await ensureConferenceQnASession(conferenceId);
      revalidatePath("/congress-admin/conferences", "layout");
      revalidatePath(`/congress-admin/conferences/${conferenceId}/qna`, "page");
      return {
         success: true,
         data: {
            livestreamSession: session,
         },
      };
   } catch (error) {
      const err = error as Error;
      return {
         success: false,
         errorMessage: err.message,
      };
   }
}

export async function disableConferenceQnAAction({
   conferenceId,
}: {
   conferenceId: CongressConferenceRecord["id"];
}): Promise<BackendResponse<null>> {
   const isAuthorized = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorized) {
      return {
         success: false,
         errorMessage: "Usuario no autorizado",
      };
   }

   try {
      await removeConferenceQnASession(conferenceId);
      revalidatePath("/congress-admin/conferences", "layout");
      revalidatePath(`/congress-admin/conferences/${conferenceId}/qna`, "page");
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
