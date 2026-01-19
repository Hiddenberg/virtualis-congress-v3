import "server-only";
import { tzDate } from "@formkit/tempo";
import { ClientResponseError, RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export interface QnALiveWithDetails extends LivestreamSession, RecordModel {
   conferenceTitle: string;
   conferenceStartTime: string;
   conferenceEndTime: string;
   conferenceId: string;
   speakersNames: string[];
   presenterName?: string;
}

export async function getAllQnALivesWithConferenceDetails() {
   try {
      // Get all QnA livestream sessions with expanded conference data
      const qnaLivestreamSessions = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .getFullList<
            LivestreamSession &
               RecordModel & {
                  expand: {
                     conference: CongressConference &
                        RecordModel & {
                           expand: {
                              speakers: (User & RecordModel)[];
                              presenter?: User & RecordModel;
                           };
                        };
                  };
               }
         >({
            filter: `sessionType="qna_live" && (conference.startTime >= "${tzDate(
               "2025-04-10T00:00",
               "America/Mexico_City",
            )
               .toISOString()
               .replace("T", " ")}" && conference.startTime <"${tzDate(
               "2025-04-13T00:00",
               "America/Mexico_City",
            )
               .toISOString()
               .replace("T", " ")}")`,
            expand: "conference, conference.speakers, conference.presenter",
            sort: "conference.startTime", // Sort by creation date descending (newest first)
         });

      // Transform the data to include only what we need
      const qnaLivesWithDetails: QnALiveWithDetails[] =
         qnaLivestreamSessions.map((session) => {
            const conference = session.expand?.conference;

            return {
               ...session,
               conferenceId: conference?.id,
               conferenceTitle: conference?.title || "Unknown Conference",
               conferenceStartTime: conference?.startTime,
               conferenceEndTime: conference?.endTime,
               speakersNames:
                  conference?.expand?.speakers?.map(
                     (speaker) => speaker.name,
                  ) || [],
               presenterName: conference?.expand?.presenter?.name,
               expand: undefined, // Remove expand to keep the response clean
            };
         });

      return qnaLivesWithDetails;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return [];
      }

      console.error(
         "[Livestream Aggregator] Error getting QnA livestreams with conference details",
         error,
      );
      throw error;
   }
}

interface QnALiveWithConferenceDetails extends LivestreamSession, RecordModel {
   expand: {
      conference: CongressConference &
         RecordModel & {
            expand: {
               speakers: (User & RecordModel)[];
               presenter?: User & RecordModel;
            };
         };
   };
}
export async function getQnALiveWithConferenceDetails(conferenceId: string) {
   try {
      const qnaLivestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .getFirstListItem<QnALiveWithConferenceDetails>(
            `sessionType="qna_live" && conference.id="${conferenceId}"`,
            {
               expand: "conference.speakers, conference.presenter",
            },
         );

      return {
         ...qnaLivestreamSession,
         conferenceTitle: qnaLivestreamSession.expand.conference.title,
         conferenceShortDescription:
            qnaLivestreamSession.expand.conference.shortDescription,
         speakerDetails:
            qnaLivestreamSession.expand.conference.expand.speakers.map(
               (speaker) => {
                  return {
                     id: speaker.id,
                     name: speaker.name,
                  };
               },
            ),
         presenterName:
            qnaLivestreamSession.expand.conference.expand.presenter?.name,
         expand: undefined,
      };
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
   }
}
