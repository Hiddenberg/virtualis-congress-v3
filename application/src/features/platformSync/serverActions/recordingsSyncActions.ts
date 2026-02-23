"use server";

import { getConferenceLivestreamSession } from "@/features/conferences/services/conferenceLivestreamsServices";
import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import { getConferenceRecording, linkRecordingToConference } from "@/features/conferences/services/conferenceRecordingsServices";
import { getAllCongressConferences, getAllProgramConferences } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   getMuxAssetByMuxLivestreamId,
   getMuxLivestreamRecordByLivestreamSessionId,
} from "@/features/livestreams/services/muxLivestreamServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import {
   createRecordingCampaign,
   ensuredRecordingCampaign,
   getAllCampaignRecordings,
   getRecordingsCampaignById,
} from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { createRecordingLivestream } from "@/features/simpleRecordings/services/recordingLivestreamServices";
import {
   createRecordingPresentation,
   getRecordingPresentationByRecordingId,
} from "@/features/simpleRecordings/services/recordingPresentationsServices";
import {
   createRecordingRecord,
   deleteRecording,
   getAllSimpleRecordings,
   getSimpleRecordingByTitleAndCampaign,
   updateSimpleRecording,
   updateSimpleRecordingDuration,
} from "@/features/simpleRecordings/services/recordingsServices";
import type { SimpleRecordingCampaignRecord, SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import { getUserById } from "@/features/users/services/userServices";
import { deleteDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import { getMuxAssetDuration } from "@/services/muxServices";

export async function ensureAllRecordingsHaveDuration(): Promise<
   BackendResponse<{
      recordingsUpdated: string[];
      recordingsWithError: string[];
   }>
> {
   const allOrganizationRecordings = await getAllSimpleRecordings();

   const recordingsUpdated = [];
   const recordingsWithError = [];

   for (const recording of allOrganizationRecordings) {
      if (
         recording.status === "ready" &&
         recording.muxAssetId
         // recording.durationSeconds === 0
      ) {
         try {
            const duration = await getMuxAssetDuration(recording.muxAssetId);
            if (!duration) {
               console.error(`[CongressAdminSynchPage] Error getting mux asset duration for recording ${recording.id}`);
               recordingsWithError.push(recording.id);
               continue;
            }
            await updateSimpleRecordingDuration(recording.id, duration);
            recordingsUpdated.push(recording.id);
         } catch (error) {
            console.error(`[CongressAdminSynchPage] Error getting mux asset duration for recording ${recording.id}`, error);
            recordingsWithError.push(recording.id);
         }
      }
   }

   return {
      success: true,
      data: {
         recordingsUpdated,
         recordingsWithError,
      },
   };
}

export async function syncCongressRecordings(): Promise<
   BackendResponse<{
      createdRecordings: string[];
      copiedRecordings: string[];
      failedRecordings: {
         conferenceId: string;
         errorMessage: string;
      }[];
      skippedRecordings: {
         conferenceId: string;
         reason: string;
      }[];
   }>
> {
   try {
      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      // Create congress conferences recordings campagin if it doesn't exist

      const campaginTitle = `[Congress Recordings] - ${congress.title}`;
      // Check if the campagin exists
      let congressRecordingsCampaign = await getSingleDBRecord<SimpleRecordingCampaignRecord>(
         "SIMPLE_RECORDING_CAMPAIGNS",
         pbFilter(
            `
            organization = {:organizationId} &&
            title = {:campaginTitle}
            `,
            {
               organizationId: organization.id,
               campaginTitle,
            },
         ),
      );
      if (!congressRecordingsCampaign) {
         congressRecordingsCampaign = await createRecordingCampaign(campaginTitle, "Conferencias grabadas del congreso");
      }

      // Get all congress conferences
      const allConferences = await getAllProgramConferences();

      const createdRecordings = [];
      const copiedRecordings = [];
      const failedRecordings: {
         conferenceId: string;
         errorMessage: string;
      }[] = [];
      const skippedRecordings: {
         conferenceId: string;
         reason: string;
      }[] = [];

      // Create recordings for each conference
      for (const conference of allConferences) {
         if (conference.conferenceType === "break") {
            console.log("Conference is a break, skipping", conference.id);
            skippedRecordings.push({
               conferenceId: conference.id,
               reason: "Conference is a break",
            });
            continue;
         }
         const conferenceRecordingTitle = `[Congress Recording] - ${conference.title}`;
         // Check if the conference recording already exists in the campaign
         const recording = await getSingleDBRecord<SimpleRecordingRecord>(
            "SIMPLE_RECORDINGS",
            pbFilter(
               `
               organization = {:organizationId} &&
               title = {:conferenceRecordingTitle} &&
               campaign = {:congressRecordingsCampaignId}
            `,
               {
                  organizationId: organization.id,
                  conferenceRecordingTitle,
                  congressRecordingsCampaignId: congressRecordingsCampaign.id,
               },
            ),
         );
         if (recording) {
            console.log("Recording already exists for conference, skipping", conference.id);
            skippedRecordings.push({
               conferenceId: conference.id,
               reason: "Recording already exists for conference",
            });
            continue;
         }

         // Check if the conference was already pre-recorded
         const conferenceRecording = await getConferenceRecording(conference.id);
         if (conferenceRecording) {
            // Add the existing recording to the campaign as a copy
            const recordingCopy = {
               ...conferenceRecording,
               id: undefined,
            };
            const createdRecording = await createRecordingRecord({
               ...recordingCopy,
               campaign: congressRecordingsCampaign.id,
               title: conferenceRecordingTitle,
               recorderName: "Automated Recording",
               status: "ready",
            });

            const recordingPresentation = await getRecordingPresentationByRecordingId(conferenceRecording.id);
            if (recordingPresentation) {
               await createRecordingPresentation(createdRecording.id, recordingPresentation.id);
            }
            console.log("Recording copied to campaign", conference.id);
            copiedRecordings.push(conference.id);
            continue;
         }

         // If the conference was live obtain the livestream session and its mux asset
         if (conference.conferenceType === "in-person" || conference.conferenceType === "livestream") {
            const livestreamSession = await getConferenceLivestreamSession(conference.id);
            const livestreamMuxAssetRecord = await getMuxLivestreamRecordByLivestreamSessionId(livestreamSession?.id ?? "");
            if (!livestreamMuxAssetRecord) {
               console.log("No mux asset found for livestream session, skipping", conference.id);
               failedRecordings.push({
                  conferenceId: conference.id,
                  errorMessage: "No mux asset found for livestream session",
               });
               continue;
            }

            const muxAsset = await getMuxAssetByMuxLivestreamId(livestreamMuxAssetRecord.muxLivestreamId);
            if (!muxAsset) {
               console.log("No mux asset found for livestream session, skipping", conference.id);
               failedRecordings.push({
                  conferenceId: conference.id,
                  errorMessage: "No mux asset found for livestream session",
               });
               continue;
            }

            // Create the recording record
            const createdRecording = await createRecordingRecord({
               campaign: congressRecordingsCampaign.id,
               title: conferenceRecordingTitle,
               recorderName: "Automated Recording",
               status: "ready",
               recorderEmail: "automated@recording.com",
               invitationEmailStatus: "not_sent",
               recordingType: "only_camera",
               durationSeconds: muxAsset.duration ?? 0,
               organization: organization.id,
               muxAssetId: muxAsset.id,
               muxPlaybackId: muxAsset.playback_ids?.[0]?.id ?? "",
            });

            const conferencePresentation = await getConferencePresentation(conference.id);
            if (conferencePresentation) {
               const presentationRecording = await getPresentationRecordingByPresentationId(conferencePresentation.id);
               if (!presentationRecording) {
                  console.log("No presentation recording found for conference, skipping", conference.id);
               } else {
                  // Link the presentation recording to the recording that was created
                  await createRecordingPresentation(createdRecording.id, conferencePresentation.id);

                  await updateSimpleRecording(createdRecording.id, {
                     recordingType: "camera_and_presentation",
                  });
               }
            }

            console.log("Recording created for conference", conference.id);
            createdRecordings.push(createdRecording.id);
         }
      }

      console.log("Recordings created", createdRecordings);
      console.log("Recordings copied", copiedRecordings);
      console.log("Recordings failed", failedRecordings);
      console.log("Recordings skipped", skippedRecordings);

      return {
         success: true,
         data: {
            createdRecordings,
            copiedRecordings,
            failedRecordings,
            skippedRecordings,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export interface ScheduleAllConferenceRecordingsResult {
   createdRecordings: string[];
   skippedRecordings: {
      conferenceId: string;
      reason: string;
   }[];
   failedRecordings: {
      conferenceId: string;
      errorMessage: string;
   }[];
}
export async function scheduleAllConferenceRecordingsAction(): Promise<BackendResponse<ScheduleAllConferenceRecordingsResult>> {
   try {
      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      const allConferences = await getAllCongressConferences(congress.id);
      const campaignTitle = `Conferencias del congreso: ${congress.title}`;

      // Check if the campaign exists
      const conferenceRecordingsCampaign = await ensuredRecordingCampaign(campaignTitle);

      const createdRecordings = [];
      const skippedRecordings: {
         conferenceId: string;
         reason: string;
      }[] = [];
      const failedRecordings: {
         conferenceId: string;
         errorMessage: string;
      }[] = [];

      for (const conference of allConferences) {
         try {
            // This applies only to simulated livestreams
            if (conference.conferenceType !== "simulated_livestream") {
               console.log("Conference is not a simulated livestream, skipping", conference.id);
               skippedRecordings.push({
                  conferenceId: conference.id,
                  reason: "Conference is not a simulated livestream",
               });
               continue;
            }

            const conferenceRecordingTitle = `Grabación de conferencia - ${conference.title}`;
            const conferenceSpeakers = await getConferenceSpeakers(conference.id);
            const conferenceSpeaker = conferenceSpeakers.length > 0 ? conferenceSpeakers[0] : undefined;
            const speakerUser = await getUserById(conferenceSpeaker?.user ?? "");

            // Check if the conference recording already exists in the campaign
            const existingRecording = await getSimpleRecordingByTitleAndCampaign({
               title: conferenceRecordingTitle,
               campaignId: conferenceRecordingsCampaign.id,
            });
            // If the recording exists, skip it
            if (existingRecording) {
               console.log("Recording already exists for conference, skipping", conference.id);
               skippedRecordings.push({
                  conferenceId: conference.id,
                  reason: "Recording already exists for conference",
               });
               continue;
            }

            // Create the recording record
            const createdRecording = await createRecordingRecord({
               organization: organization.id,
               campaign: conferenceRecordingsCampaign.id,
               title: conferenceRecordingTitle,
               recorderName: conferenceSpeaker
                  ? `${conferenceSpeaker.academicTitle} ${conferenceSpeaker.displayName}`
                  : "Automated Recording",
               status: "scheduled",
               recorderEmail: speakerUser?.email ?? "automated@recording.com",
               recordingType: "camera_and_presentation",
               invitationEmailStatus: "not_sent",
               durationSeconds: 0,
            });
            // Create the recording livestream
            await createRecordingLivestream(createdRecording.id);
            // Link the recording to the conference
            await linkRecordingToConference({
               conferenceId: conference.id,
               recordingId: createdRecording.id,
            });

            console.log("Recording created for conference", conference.id);
            createdRecordings.push(createdRecording.id);
         } catch (error) {
            console.error("Error creating recording for conference", conference.id, error);
            failedRecordings.push({
               conferenceId: conference.id,
               errorMessage: error instanceof Error ? error.message : "Unknown error",
            });
         }
      }

      console.log("Recordings created", createdRecordings);

      return {
         success: true,
         data: {
            createdRecordings,
            skippedRecordings,
            failedRecordings,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function scheduleAllConferencePresentationRecordingsAction(): Promise<
   BackendResponse<ScheduleAllConferenceRecordingsResult>
> {
   try {
      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      const allConferences = await getAllCongressConferences(congress.id);
      const campaignTitle = `Presentaciones del congreso: ${congress.title}`;

      // Check if the campaign exists
      const conferenceRecordingsCampaign = await ensuredRecordingCampaign(campaignTitle);

      const createdRecordings = [];
      const skippedRecordings: {
         conferenceId: string;
         reason: string;
      }[] = [];
      const failedRecordings: {
         conferenceId: string;
         errorMessage: string;
      }[] = [];

      for (const conference of allConferences) {
         try {
            // This applies only to simulated livestreams
            if (conference.conferenceType !== "simulated_livestream") {
               console.log("Conference is not a simulated livestream, skipping", conference.id);
               skippedRecordings.push({
                  conferenceId: conference.id,
                  reason: "Conference is not a simulated livestream",
               });
               continue;
            }

            const conferenceSpeakers = await getConferenceSpeakers(conference.id);
            const conferenceSpeaker = conferenceSpeakers.length > 0 ? conferenceSpeakers[0] : undefined;
            const conferenceRecordingTitle = `Presentación de la conferencia: ${conference.title} ${conferenceSpeaker ? ` | Ponente: ${conferenceSpeaker.academicTitle} ${conferenceSpeaker.displayName}` : ""}`;

            // Check if the conference recording already exists in the campaign
            const existingRecording = await getSimpleRecordingByTitleAndCampaign({
               title: conferenceRecordingTitle,
               campaignId: conferenceRecordingsCampaign.id,
            });
            // If the recording exists, skip it
            if (existingRecording) {
               console.log("Recording already exists for conference, skipping", conference.id);
               skippedRecordings.push({
                  conferenceId: conference.id,
                  reason: "Recording already exists for conference",
               });
               continue;
            }

            // Create the recording record
            const createdRecording = await createRecordingRecord({
               organization: organization.id,
               campaign: conferenceRecordingsCampaign.id,
               title: conferenceRecordingTitle,
               status: "scheduled",
               recordingType: "only_camera",
               invitationEmailStatus: "not_sent",
               durationSeconds: 0,
            });
            // Create the recording livestream
            await createRecordingLivestream(createdRecording.id);

            console.log("Recording created for conference", conference.id);
            createdRecordings.push(createdRecording.id);
         } catch (error) {
            console.error("Error creating recording for conference", conference.id, error);
            failedRecordings.push({
               conferenceId: conference.id,
               errorMessage: error instanceof Error ? error.message : "Unknown error",
            });
         }
      }

      console.log("CV Presentation Recordings created", createdRecordings);

      return {
         success: true,
         data: {
            createdRecordings,
            skippedRecordings,
            failedRecordings,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function deleteRecordingsCampaign(campaignId: string): Promise<BackendResponse<null>> {
   try {
      const campaign = await getRecordingsCampaignById(campaignId);
      if (!campaign) {
         return {
            success: false,
            errorMessage: "Campaign not found",
         };
      }

      const campaignRecordings = await getAllCampaignRecordings(campaignId);

      for (const recording of campaignRecordings) {
         await deleteRecording(recording.id);
      }

      await deleteDBRecord("SIMPLE_RECORDING_CAMPAIGNS", campaignId);

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}
