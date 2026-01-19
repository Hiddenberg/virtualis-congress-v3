import "server-only";

import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";

export async function linkQuestionPollToConference(
   conferenceId: CongressConferenceRecord["id"],
   pollId: QuestionPollRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const existing = await getConferenceQuestionPollRecord(conferenceId, pollId);
   if (existing) return existing;

   const record = await createDBRecord<ConferenceQuestionPoll>(
      "CONFERENCE_QUESTION_POLLS",
      {
         organization: organization.id,
         conference: conferenceId,
         questionPoll: pollId,
      },
   );

   return record;
}

export async function getConferenceQuestionPollRecord(
   conferenceId: CongressConferenceRecord["id"],
   pollId: QuestionPollRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      conference = {:conferenceId} &&
      questionPoll = {:pollId}
   `,
      {
         organizationId: organization.id,
         conferenceId,
         pollId,
      },
   );

   const record = await getSingleDBRecord<ConferenceQuestionPoll>(
      "CONFERENCE_QUESTION_POLLS",
      filter,
   );
   return record;
}

export async function getConferenceQuestionPollRecords(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      conference = {:conferenceId}
   `,
      {
         organizationId: organization.id,
         conferenceId,
      },
   );

   const records = await getFullDBRecordsList<
      ConferenceQuestionPoll & {
         expand: { questionPoll: QuestionPollRecord };
      }
   >("CONFERENCE_QUESTION_POLLS", {
      filter,
      expand: "questionPoll",
      sort: "-created",
   });

   return records;
}

export async function getAllQuestionPollsForConference(
   conferenceId: CongressConferenceRecord["id"],
) {
   const records = await getConferenceQuestionPollRecords(conferenceId);
   return records.map((record) => record.expand.questionPoll);
}

export async function getActiveQuestionPollForConference(
   conferenceId: CongressConferenceRecord["id"],
) {
   const questionPolls = await getAllQuestionPollsForConference(conferenceId);
   return (
      questionPolls.find((questionPoll) => questionPoll.status === "active") ??
      null
   );
}

export async function unlinkQuestionPollFromConference(
   conferenceId: CongressConferenceRecord["id"],
   pollId: QuestionPollRecord["id"],
) {
   const record = await getConferenceQuestionPollRecord(conferenceId, pollId);
   if (!record) return null;

   await deleteDBRecord("CONFERENCE_QUESTION_POLLS", record.id);
   return null;
}
