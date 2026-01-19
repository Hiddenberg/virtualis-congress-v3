import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";

export async function getRealtimePresentationStateByPresentationId(
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

   const state = await getSingleDBRecord<RealtimePresentationState>(
      "PRESENTATION_REALTIME_STATES",
      filter,
   );

   return state;
}

export async function ensureRealtimePresentationState(
   presentationId: PresentationRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const existing =
      await getRealtimePresentationStateByPresentationId(presentationId);
   if (existing) return existing;

   const created = await createDBRecord<RealtimePresentationState>(
      "PRESENTATION_REALTIME_STATES",
      {
         organization: organization.id,
         presentation: presentationId,
         currentSlideIndex: 0,
         isHidden: false,
      },
   );

   return created;
}

export async function updateRealtimePresentationStateByPresentationId(
   presentationId: PresentationRecord["id"],
   updates: Partial<
      Pick<
         RealtimePresentationState,
         "currentSlideIndex" | "isHidden" | "userControlling"
      >
   >,
) {
   const existing =
      await getRealtimePresentationStateByPresentationId(presentationId);
   if (!existing) {
      const created = await ensureRealtimePresentationState(presentationId);
      const updated = await updateDBRecord<RealtimePresentationState>(
         "PRESENTATION_REALTIME_STATES",
         created.id,
         updates,
      );
      return updated;
   }

   const updated = await updateDBRecord<RealtimePresentationState>(
      "PRESENTATION_REALTIME_STATES",
      existing.id,
      updates,
   );

   return updated;
}
