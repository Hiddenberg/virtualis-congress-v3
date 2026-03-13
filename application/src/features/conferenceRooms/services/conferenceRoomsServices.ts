import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import type { ConferenceRoom, ConferenceRoomRecord, NewConferenceRoomData } from "../types/conferenceRoomsTypes";

export async function createConferenceRoomRecord(newConferenceRoomData: NewConferenceRoomData) {
   const organization = await getOrganizationFromSubdomain();

   const newConferenceRoomRecord = await createDBRecord<ConferenceRoom>("CONFERENCE_ROOMS", {
      organization: organization.id,
      ...newConferenceRoomData,
   });

   return newConferenceRoomRecord;
}

export async function getConferenceRoomById(conferenceRoomId: ConferenceRoomRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:conferenceRoomId}
   `,
      {
         organizationId: organization.id,
         conferenceRoomId,
      },
   );
   const conferenceRoom = await getSingleDBRecord<ConferenceRoom>("CONFERENCE_ROOMS", filter);
   return conferenceRoom;
}

export async function getAllCongressConferenceRooms(congressId: CongressRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId,
      },
   );

   const conferenceRooms = await getFullDBRecordsList<ConferenceRoom>("CONFERENCE_ROOMS", {
      filter,
   });

   return conferenceRooms;
}

export async function updateConferenceRoomRecord(
   conferenceRoomId: ConferenceRoomRecord["id"],
   updatedConferenceRoomData: Partial<ConferenceRoom>,
) {
   const organization = await getOrganizationFromSubdomain();

   const updatedConferenceRoomRecord = await updateDBRecord<ConferenceRoom>("CONFERENCE_ROOMS", conferenceRoomId, {
      organization: organization.id,
      ...updatedConferenceRoomData,
   });

   return updatedConferenceRoomRecord;
}

export async function deleteConferenceRoomRecord(conferenceRoomId: ConferenceRoomRecord["id"]) {
   await deleteDBRecord("CONFERENCE_ROOMS", conferenceRoomId);
}
