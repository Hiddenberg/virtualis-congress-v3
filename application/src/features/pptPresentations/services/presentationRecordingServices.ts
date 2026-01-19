import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";

export async function createPresentationRecordingRecord(
   recording: PresentationRecording,
) {
   const createdPresentationRecording =
      await createDBRecord<PresentationRecording>(
         "PRESENTATION_RECORDINGS",
         recording,
      );

   return createdPresentationRecording;
}

export async function updatePresentationRecording(
   recordingId: PresentationRecordingRecord["id"],
   recording: Partial<PresentationRecording>,
) {
   const updated = await updateDBRecord<PresentationRecording>(
      "PRESENTATION_RECORDINGS",
      recordingId,
      recording,
   );

   return updated;
}

export async function getPresentationRecordingByPresentationId(
   presentationId: PresentationRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      presentation = {:presentationId}
   `,
      {
         organizationId: organization.id,
         presentationId,
      },
   );

   const presentationRecording = await getSingleDBRecord<PresentationRecording>(
      "PRESENTATION_RECORDINGS",
      filter,
   );

   return presentationRecording;
}

export async function savePresentationRecording(
   presentationId: PresentationRecord["id"],
   slideChanges: PresentationRecordingSlideChange[],
): Promise<PresentationRecordingRecord> {
   const organization = await getOrganizationFromSubdomain();

   const existing =
      await getPresentationRecordingByPresentationId(presentationId);
   if (existing) {
      const updatedPresentationRecording = await updatePresentationRecording(
         existing.id,
         {
            slideChanges,
         },
      );
      return updatedPresentationRecording;
   }

   const created = await createPresentationRecordingRecord({
      organization: organization.id,
      presentation: presentationId,
      slideChanges,
   });

   return created;
}

export async function deletePresentationRecording(
   presentationRecordingId: PresentationRecordingRecord["id"],
) {
   await deleteDBRecord("PRESENTATION_RECORDINGS", presentationRecordingId);

   return null;
}
