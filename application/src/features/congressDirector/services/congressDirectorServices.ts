import "server-only";
import {
   getAllCongressConferences,
   getConferenceById,
   updateConference,
} from "@/features/conferences/services/conferenceServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   ensuredCongressInPersonState,
   markConferenceAsFinished,
   markConferenceAsStarted,
   setCongressInPersonStateToStandby,
} from "@/features/congressInPersonState/services/congressInPersonStateServices";

export interface ActiveAndNextConferenceResult {
   activeConference: CongressConferenceRecord | null;
   nextConference: CongressConferenceRecord | null;
}

export async function getActiveAndNextConferences(): Promise<ActiveAndNextConferenceResult> {
   const congress = await getLatestCongress();
   const allConferences = await getAllCongressConferences(congress.id);
   const inPersonState = await ensuredCongressInPersonState();

   const activeConferenceId = inPersonState.activeConference;
   const activeConference = activeConferenceId ? (allConferences.find((c) => c.id === activeConferenceId) ?? null) : null;

   const lastFinishedConferenceIndex = allConferences.findLastIndex((c) => c.status === "finished" || c.status === "canceled");
   const nextConference = lastFinishedConferenceIndex !== -1 ? allConferences[lastFinishedConferenceIndex + 1] : null;

   // const now = new Date();
   // const nextConference =
   //    allConferences
   //       .filter((c) => c.status === "scheduled" && new Date(c.startTime) > now)
   //       .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;

   return {
      activeConference,
      nextConference: nextConference ?? null,
   };
}

export async function startConferenceOrSwitch(conferenceId: CongressConferenceRecord["id"]) {
   const inPersonState = await ensuredCongressInPersonState();
   const currentActiveId = inPersonState.activeConference;

   if (currentActiveId && currentActiveId !== conferenceId) {
      // Finish the currently active conference to enforce single-active invariant
      await markConferenceAsFinished(currentActiveId);
   }

   // Ensure the target conference is not canceled/finished accidentally
   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      throw new Error("La conferencia no existe");
   }
   if (conference.status === "canceled") {
      throw new Error("No se puede iniciar una conferencia cancelada");
   }

   await markConferenceAsStarted(conferenceId);
}

export async function finishConference(conferenceId: CongressConferenceRecord["id"]) {
   await markConferenceAsFinished(conferenceId);
}

export async function standbyCongress() {
   await setCongressInPersonStateToStandby();
}

export async function forceCancelActiveConferenceIfAny() {
   const inPersonState = await ensuredCongressInPersonState();
   const currentActiveId = inPersonState.activeConference;
   if (!currentActiveId) return;
   await updateConference(currentActiveId, {
      status: "finished",
   });
}
