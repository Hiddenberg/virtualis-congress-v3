import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, deleteDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { ConferencePresentation } from "../types/conferencePresentations";

export async function getAllConferencePresentations() {
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

   const presentations = await getFullDBRecordsList<
      ConferencePresentation & {
         expand: {
            presentation: PresentationRecord;
         };
      }
   >("CONFERENCE_PRESENTATIONS", {
      filter,
      expand: "presentation",
   });

   return presentations.map((presentation) => ({
      conference: presentation.conference,
      presentation: presentation.expand.presentation,
   }));
}

export async function getConferencePresentation(conferenceId: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      conference = {:conferenceId}
      `,
      {
         organizationId: organization.id,
         congressId: congress.id,
         conferenceId,
      },
   );

   const conferencePresentationRecord = await getSingleDBRecord<
      ConferencePresentation & {
         expand: {
            presentation: PresentationRecord;
         };
      }
   >("CONFERENCE_PRESENTATIONS", filter, {
      expand: "presentation",
   });

   return conferencePresentationRecord?.expand.presentation ?? null;
}

export async function linkPresentationToConference(conferenceId: string, presentationId: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const record: ConferencePresentation = {
      organization: organization.id,
      congress: congress.id,
      conference: conferenceId,
      presentation: presentationId,
   };

   const created = await createDBRecord<ConferencePresentation>("CONFERENCE_PRESENTATIONS", record);
   return created;
}

export async function unlinkPresentationFromConference(conferenceId: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      conference = {:conferenceId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
         conferenceId,
      },
   );

   const link = await getSingleDBRecord<ConferencePresentation>("CONFERENCE_PRESENTATIONS", filter);
   if (!link) return null;
   await deleteDBRecord("CONFERENCE_PRESENTATIONS", link.id);
   return null;
}
