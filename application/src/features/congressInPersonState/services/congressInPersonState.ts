import { updateConference } from "@/features/conferences/services/conferenceServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import "server-only";

export async function ensuredCongressInPersonState() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const existingState = await getSingleDBRecord<CongressInPersonState>("CONGRESS_IN_PERSON_STATE", filter);

   if (existingState) {
      return existingState;
   }

   const createdState = await createDBRecord<CongressInPersonState>("CONGRESS_IN_PERSON_STATE", {
      organization: organization.id,
      congress: congress.id,
      activeConference: null,
      status: "standby",
   });

   return createdState;
}

export async function markConferenceAsStarted(conferenceId: CongressConferenceRecord["id"]) {
   await updateConference(conferenceId, {
      status: "active",
   });

   await updateCongressInPersonState({
      activeConference: conferenceId,
   });
}

export async function markConferenceAsFinished(conferenceId: CongressConferenceRecord["id"]) {
   await updateConference(conferenceId, {
      status: "finished",
   });

   await updateCongressInPersonState({
      activeConference: null,
   });
}

export async function setCongressInPersonStateToStandby() {
   await updateCongressInPersonState({
      status: "standby",
   });
}

export async function updateCongressInPersonState(newState: Partial<CongressInPersonState>) {
   const existingState = await ensuredCongressInPersonState();
   const updatedState = await updateDBRecord<CongressInPersonState>("CONGRESS_IN_PERSON_STATE", existingState.id, newState);
   return updatedState;
}

export async function setCongressInPersonStatus(newStatus: "active" | "standby") {
   await updateCongressInPersonState({
      status: newStatus,
   });
}
