import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import { deleteMuxLivestream } from "./muxLivestreamServices";

export async function createLivestreamSession() {
   const currentOrganization = await getOrganizationFromSubdomain();

   if (!currentOrganization) {
      throw new Error(
         "[Livestream Session Service] Current organization not found",
      );
   }

   const createdLivestreamSession = await createDBRecord<LivestreamSession>(
      "LIVESTREAM_SESSIONS",
      {
         organization: currentOrganization.id,
         status: "scheduled",
         attendantStatus: "scheduled",
      },
   );

   return createdLivestreamSession;
}

export async function getLivestreamSessionById(livestreamSessionId: string) {
   const currentOrganization = await getOrganizationFromSubdomain();

   if (!currentOrganization) {
      throw new Error(
         "[Livestream Session Service] Current organization not found",
      );
   }

   const livestreamSession = await getSingleDBRecord<LivestreamSessionRecord>(
      "LIVESTREAM_SESSIONS",
      `organization = "${currentOrganization.id}" && id = "${livestreamSessionId}"`,
   );

   if (!livestreamSession) {
      console.error(
         `[Livestream Session Service] Livestream session with id ${livestreamSessionId} not found for organization ${currentOrganization.id}`,
      );
   }

   return livestreamSession;
}

export async function getLivestreamSessionByMuxLivestreamId(
   muxLivestreamId: string,
) {
   const currentOrganization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      muxLivestreamId = {:muxLivestreamId}
   `,
      {
         organizationId: currentOrganization.id,
         muxLivestreamId,
      },
   );

   const livestreamSession = await getSingleDBRecord<
      LivestreamMuxLivestream & {
         expand: {
            livestreamSession: LivestreamSessionRecord;
         };
      }
   >("LIVESTREAM_MUX_LIVESTREAMS", filter, {
      expand: "livestreamSession",
   });

   return livestreamSession?.expand.livestreamSession ?? null;
}

export async function getGlobalLivestreamSessionByMuxLivestreamId(
   muxLivestreamId: string,
) {
   const filter = pbFilter(
      `
      muxLivestreamId = {:muxLivestreamId}
   `,
      {
         muxLivestreamId,
      },
   );

   const livestreamSession = await getSingleDBRecord<
      LivestreamMuxLivestream & {
         expand: {
            livestreamSession: LivestreamSessionRecord;
         };
      }
   >("LIVESTREAM_MUX_LIVESTREAMS", filter, {
      expand: "livestreamSession",
   });

   return livestreamSession?.expand.livestreamSession ?? null;
}

export async function updateLivestreamSession(
   livestreamSessionId: string,
   newLivestreamSessionData: Partial<LivestreamSession>,
) {
   const livestreamSession =
      await getLivestreamSessionById(livestreamSessionId);

   if (!livestreamSession) {
      throw new Error(
         "[Livestream Session Service] Livestream session not found",
      );
   }

   const updatedLivestreamSession = await updateDBRecord<LivestreamSession>(
      "LIVESTREAM_SESSIONS",
      livestreamSessionId,
      newLivestreamSessionData,
   );

   return updatedLivestreamSession;
}

export async function updateLivestreamSessionStatus(
   livestreamSessionId: string,
   newStatus: LivestreamSession["status"],
) {
   const updatedLivestreamSession = await updateDBRecord<LivestreamSession>(
      "LIVESTREAM_SESSIONS",
      livestreamSessionId,
      {
         status: newStatus,
      } satisfies Partial<LivestreamSession>,
   );

   return updatedLivestreamSession;
}

export async function updateLivestreamSessionAttendantStatus(
   livestreamSessionId: string,
   newAttendantStatus: LivestreamSession["attendantStatus"],
) {
   const updatedLivestreamSession = await updateDBRecord<LivestreamSession>(
      "LIVESTREAM_SESSIONS",
      livestreamSessionId,
      {
         attendantStatus: newAttendantStatus,
      } satisfies Partial<LivestreamSession>,
   );

   return updatedLivestreamSession;
}

export async function deleteLivestreamSessionRecord(
   livestreamSessionId: string,
) {
   const livestreamSession =
      await getLivestreamSessionById(livestreamSessionId);

   if (!livestreamSession) {
      throw new Error(
         "[Livestream Session Service] Livestream session not found",
      );
   }

   await deleteDBRecord("LIVESTREAM_SESSIONS", livestreamSessionId);
}

export async function deleteLivestreamSessionResources(
   livestreamSessionId: string,
) {
   const livestreamSession =
      await getLivestreamSessionById(livestreamSessionId);

   if (!livestreamSession) {
      console.error(
         "[Livestream Session Service] Livestream session not found or already deleted",
         livestreamSessionId,
      );
      return;
   }

   await deleteMuxLivestream(livestreamSessionId);
   await deleteDBRecord("LIVESTREAM_SESSIONS", livestreamSessionId);
}
