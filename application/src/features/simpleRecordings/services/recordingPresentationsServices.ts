import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   deletePresentationRecording,
   getPresentationRecordingByPresentationId,
} from "@/features/pptPresentations/services/presentationRecordingServices";
import {
   createDBRecord,
   deleteDBRecord,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";

export async function createRecordingPresentation(
   recordingId: SimpleRecordingRecord["id"],
   presentationId: PresentationRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const recordingPresentation = await createDBRecord<RecordingPresentation>(
      "SIMPLE_RECORDING_PRESENTATIONS",
      {
         organization: organization.id,
         recording: recordingId,
         presentation: presentationId,
      },
   );

   return recordingPresentation;
}

export async function getRecordingPresentationByRecordingId(
   recordingId: SimpleRecordingRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      recording = {:recordingId}
   `,
      {
         organizationId: organization.id,
         recordingId,
      },
   );

   const recordingPresentation = await getSingleDBRecord<
      RecordingPresentation & {
         expand: {
            presentation: PresentationRecord;
         };
      }
   >("SIMPLE_RECORDING_PRESENTATIONS", filter, {
      expand: "presentation",
   });

   return recordingPresentation?.expand.presentation ?? null;
}

export async function getRecordingPresentationRecordByRecordingId(
   recordingId: SimpleRecordingRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      recording = {:recordingId}
   `,
      {
         organizationId: organization.id,
         recordingId,
      },
   );

   const recordingPresentation = await getSingleDBRecord<RecordingPresentation>(
      "SIMPLE_RECORDING_PRESENTATIONS",
      filter,
   );

   return recordingPresentation;
}

export async function getRecordingPresentationRecordByPresentationId({
   organizationId,
   presentationId,
}: {
   organizationId: string;
   presentationId: PresentationRecord["id"];
}) {
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      presentation = {:presentationId}
   `,
      {
         organizationId,
         presentationId,
      },
   );

   const recordingPresentation = await getSingleDBRecord<RecordingPresentation>(
      "SIMPLE_RECORDING_PRESENTATIONS",
      filter,
   );

   return recordingPresentation;
}

export async function deleteRecordingPresentation(
   recordingId: SimpleRecordingRecord["id"],
) {
   const recordingPresentation =
      await getRecordingPresentationByRecordingId(recordingId);
   if (!recordingPresentation) {
      throw new Error("Recording presentation not found");
   }

   await deleteDBRecord("PRESENTATIONS", recordingPresentation.id);
}

export async function deletePresentationRecordingForRecording(
   recordingId: SimpleRecordingRecord["id"],
) {
   //Check if the recording has a presentation linked
   const recordingPresentation =
      await getRecordingPresentationByRecordingId(recordingId);
   if (recordingPresentation === null) {
      console.log(
         `[deletePresentationRecordingForRecording] No presentation linked to recording ${recordingId}`,
      );
      return;
   }
   // Check if the presentation has a presentation recording and delete it
   const presentationRecording = await getPresentationRecordingByPresentationId(
      recordingPresentation.id,
   );

   if (presentationRecording === null) {
      console.log(
         `[deletePresentationRecordingForRecording] No presentation recording linked to presentation ${recordingPresentation.id}`,
      );
      return;
   }

   // Delete the presentation recording
   await deletePresentationRecording(presentationRecording.id);
   console.log(
      `[deletePresentationRecordingForRecording] Presentation recording ${presentationRecording.id} deleted for recording ${recordingId}`,
   );
}
