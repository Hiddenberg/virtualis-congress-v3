import { ClientResponseError, RecordModel } from "pocketbase";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import pbServerClient from "@/libs/pbServerClient";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import { SpeakerData } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

interface ExpandedLobbyConference extends CongressConference, RecordModel {
   expand: {
      speakers: (User &
         RecordModel & {
            expand: {
               speakers_data_via_user: (SpeakerData & RecordModel)[];
            };
         })[];
   };
}

export async function getAllConferencesForLobby() {
   try {
      const organization = await getOrganizationFromSubdomain();
      const filter = pbFilter(
         `
         organization = {:organizationId}
      `,
         {
            organizationId: organization.id,
         },
      );
      const allExpandedConferences =
         await getFullDBRecordsList<ExpandedLobbyConference>(
            "CONGRESS_CONFERENCES",
            {
               filter,
               expand: "speakers, speakers.speakers_data_via_user",
            },
         );

      const lobbyConferences = allExpandedConferences.map((expConference) => ({
         id: expConference.id,
         title: expConference.title,
         shortDescription: expConference.shortDescription,
         speakerNames:
            expConference.expand?.speakers?.map((speaker) => {
               const speakerData = speaker.expand?.speakers_data_via_user?.[0];
               return `${speakerData?.academicTitle || ""} ${speaker.name}`;
            }) || [],
         startTime: expConference.startTime,
         endTime: expConference.endTime,
      }));

      return lobbyConferences;
   } catch (error) {
      console.error("Error fetching conferences for lobby:", error);
      return [];
   }
}
export type LobbyConference = Awaited<
   ReturnType<typeof getAllConferencesForLobby>
>[number];

export async function getClosingConference() {
   try {
      const closingConference = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
         .getFirstListItem<CongressConference & RecordModel>(
            `conferenceType = "closing_conference"`,
         );

      return closingConference;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      console.error("Error fetching closing conference:", error);
      return null;
   }
}
