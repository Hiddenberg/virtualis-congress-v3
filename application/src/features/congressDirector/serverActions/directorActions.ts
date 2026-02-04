"use server";

import { revalidatePath } from "next/cache";
import { getAllQuestionPollsForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import {
   finishConference,
   standbyCongress,
   startConferenceOrSwitch,
} from "@/features/congressDirector/services/congressDirectorServices";
import { setCongressInPersonStatus } from "@/features/congressInPersonState/services/congressInPersonStateServices";
import { setQuestionPollStatus } from "@/features/questionPolls/services/questionPollServices";

export async function startConferenceAction(conferenceId: string) {
   try {
      await startConferenceOrSwitch(conferenceId);
      revalidatePath("/congress-admin/congress-director", "layout");
      return {
         success: true as const,
      };
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al iniciar la conferencia";
      return {
         success: false as const,
         errorMessage: message,
      };
   }
}

export async function finishConferenceAction(conferenceId: string) {
   try {
      await finishConference(conferenceId);
      revalidatePath("/congress-admin/congress-director", "layout");
      return {
         success: true as const,
      };
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al finalizar la conferencia";
      return {
         success: false as const,
         errorMessage: message,
      };
   }
}

export async function standbyCongressAction() {
   try {
      await standbyCongress();
      revalidatePath("/congress-admin/congress-director", "layout");
      return {
         success: true as const,
      };
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al poner en standby";
      return {
         success: false as const,
         errorMessage: message,
      };
   }
}

export async function setStandbyStatusAction(enable: boolean) {
   try {
      await setCongressInPersonStatus(enable ? "standby" : "active");
      revalidatePath("/congress-admin/congress-director", "layout");
      return {
         success: true as const,
      };
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cambiar el estado de standby";
      return {
         success: false as const,
         errorMessage: message,
      };
   }
}

export async function setQuestionPollStatusAction(conferenceId: string, pollId: string, status: QuestionPoll["status"]) {
   try {
      if (status === "active") {
         const polls = await getAllQuestionPollsForConference(conferenceId);
         // Deactivate any other active polls for this conference
         await Promise.all(
            polls.filter((p) => p.id !== pollId && p.status === "active").map((p) => setQuestionPollStatus(p.id, "inactive")),
         );
      }

      await setQuestionPollStatus(pollId, status);
      revalidatePath("/congress-admin/congress-director", "layout");
      revalidatePath(`/preparation/${conferenceId}/question-polls`, "page");
      return {
         success: true as const,
      };
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cambiar el estado de la encuesta";
      return {
         success: false as const,
         errorMessage: message,
      };
   }
}
