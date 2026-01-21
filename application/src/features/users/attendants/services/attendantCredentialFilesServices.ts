import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import "server-only";

export async function createAttendantCredentialFile({
   userId,
   fileType,
   file,
}: {
   userId: UserRecord["id"];
   fileType: string;
   file: File;
}) {
   const organization = await getOrganizationFromSubdomain();

   const attendantCredentialFile = await createDBRecord<AttendantCredentialFile>("ATTENDANTS_CREDENTIAL_FILES", {
      organization: organization.id,
      user: userId,
      fileType,
      file,
   });

   return attendantCredentialFile;
}

export async function createOrUpdateAttendantCredentialFile({
   userId,
   fileType,
   file,
}: {
   userId: UserRecord["id"];
   fileType: string;
   file: File;
}) {
   const existingAttendantCredentialFile = await getAttendantCredentialFileByType({
      userId,
      fileType,
   });

   if (existingAttendantCredentialFile) {
      return await updateAttendantCredentialFile({
         userId,
         fileType,
         file,
      });
   }

   return await createAttendantCredentialFile({
      userId,
      fileType,
      file,
   });
}

export async function getAttendantCredentialFileByType({ userId, fileType }: { userId: UserRecord["id"]; fileType: string }) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      user = {:userId} &&
      fileType = {:fileType}
   `,
      {
         organizationId: organization.id,
         userId,
         fileType,
      },
   );
   const attendantCredentialFile = await getSingleDBRecord<AttendantCredentialFile>("ATTENDANTS_CREDENTIAL_FILES", filter);

   return attendantCredentialFile;
}

export async function updateAttendantCredentialFile({
   userId,
   fileType,
   file,
}: {
   userId: UserRecord["id"];
   fileType: string;
   file: File;
}) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      user = {:userId} &&
      fileType = {:fileType}
   `,
      {
         organizationId: organization.id,
         userId,
         fileType,
      },
   );

   const existingAttendantCredentialFile = await getSingleDBRecord<AttendantCredentialFile>(
      "ATTENDANTS_CREDENTIAL_FILES",
      filter,
   );

   if (!existingAttendantCredentialFile) {
      throw new Error("Attendant credential file not found");
   }

   const attendantCredentialFile = await updateDBRecord<AttendantCredentialFile>(
      "ATTENDANTS_CREDENTIAL_FILES",
      existingAttendantCredentialFile.id,
      {
         file,
      },
   );

   return attendantCredentialFile;
}
