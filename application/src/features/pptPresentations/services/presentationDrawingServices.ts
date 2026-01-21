import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { updateDBRecord } from "@/libs/pbServerClientNew";
import { getPresentationRecordingByPresentationId, savePresentationRecording } from "./presentationRecordingServices";

export async function savePresentationDrawingEvents(
   presentationId: PresentationRecord["id"],
   drawingEvents: PresentationDrawingEvent[],
): Promise<PresentationRecordingRecord> {
   await getOrganizationFromSubdomain();

   const existing = await getPresentationRecordingByPresentationId(presentationId);
   if (existing) {
      const updated = await updateDBRecord<PresentationRecording>("PRESENTATION_RECORDINGS", existing.id, {
         drawingEvents: drawingEvents,
      });
      return updated;
   }

   const created = await savePresentationRecording(presentationId, []);
   const updated = await updateDBRecord<PresentationRecording>("PRESENTATION_RECORDINGS", created.id, {
      drawingEvents,
   });
   return updated;
}
