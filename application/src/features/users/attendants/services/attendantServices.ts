import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import "server-only";
import type { UserRecord } from "../../types/userTypes";

export async function createAttendantData({
   userId,
   additionalData,
}: {
   userId: UserRecord["id"];
   additionalData: AdditionalData;
}) {
   const organization = await getOrganizationFromSubdomain();

   const attendantData = await createDBRecord<AttendantData>("ATTENDANTS_DATA", {
      organization: organization.id,
      user: userId,
      additionalData,
   });

   return attendantData;
}

export async function createOrUpdateAttendantData({
   userId,
   additionalData,
}: {
   userId: UserRecord["id"];
   additionalData: AdditionalData;
}) {
   const existingAttendantData = await getAttendantData(userId);
   // If attendant data already exists, update it
   if (existingAttendantData) {
      const updatedAttendantData = await updateAttendantData({
         userId,
         additionalData,
      });
      return updatedAttendantData;
   }

   const newAttendantData = await createAttendantData({
      userId,
      additionalData,
   });
   return newAttendantData;
}

export async function getAttendantData(userId: UserRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         userId,
      },
   );
   const attendantData = await getSingleDBRecord<AttendantData>("ATTENDANTS_DATA", filter);

   return attendantData;
}

export async function updateAttendantData({
   userId,
   additionalData,
}: {
   userId: UserRecord["id"];
   additionalData: AdditionalData;
}) {
   const existingAttendantData = await getAttendantData(userId);
   if (!existingAttendantData) {
      throw new Error("Attendant data not found");
   }

   const updatedAttendantData = await updateDBRecord<AttendantData>("ATTENDANTS_DATA", existingAttendantData.id, {
      additionalData,
   });

   return updatedAttendantData;
}
