import "server-only";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   dbBatch,
   getDBRecordById,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export async function createQuestionPoll(question: string, optionTexts: string[]) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const poll = await createDBRecord<QuestionPoll>("QUESTION_POLLS", {
      organization: organization.id,
      congress: congress.id,
      question,
      status: "inactive",
   });

   if (optionTexts.length > 0) {
      const batch = dbBatch();
      optionTexts.forEach((text) => {
         batch.collection(PB_COLLECTIONS.QUESTION_POLL_OPTIONS).create({
            organization: organization.id,
            questionPoll: poll.id,
            text,
         } satisfies QuestionPollOption);
      });
      await batch.send();
   }

   const options = await getQuestionPollOptions(poll.id);

   return {
      poll,
      options,
   };
}

export async function createQuestionPollOption(pollId: QuestionPollRecord["id"], text: string) {
   const organization = await getOrganizationFromSubdomain();
   const option = await createDBRecord<QuestionPollOption>("QUESTION_POLL_OPTIONS", {
      organization: organization.id,
      questionPoll: pollId,
      text,
   });
   return option;
}

export async function getQuestionPollById(pollId: QuestionPollRecord["id"]) {
   const poll = await getDBRecordById<QuestionPoll>("QUESTION_POLLS", pollId);
   return poll;
}

export async function getActiveQuestionPollForCongress(congressId: CongressRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      status = {:status}
   `,
      {
         organizationId: organization.id,
         congressId,
         status: "active",
      },
   );

   const poll = await getSingleDBRecord<QuestionPoll>("QUESTION_POLLS", filter);
   return poll;
}

export async function getActiveQuestionPollForCurrentCongress() {
   const congress = await getLatestCongress();
   return getActiveQuestionPollForCongress(congress.id);
}

export async function getAllQuestionPollsForCongress(congressId: CongressRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId,
      },
   );

   const polls = await getFullDBRecordsList<QuestionPoll>("QUESTION_POLLS", {
      filter,
      sort: "-created",
   });

   return polls;
}

export async function getQuestionPollOptions(pollId: QuestionPollRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      questionPoll = {:pollId}
   `,
      {
         organizationId: organization.id,
         pollId,
      },
   );

   const options = await getFullDBRecordsList<QuestionPollOption>("QUESTION_POLL_OPTIONS", {
      filter,
      sort: "created",
   });

   return options;
}

export async function finishQuestionPoll(pollId: QuestionPollRecord["id"]) {
   const updated = await updateDBRecord<QuestionPoll>("QUESTION_POLLS", pollId, {
      status: "finished",
   });
   return updated;
}

export async function setQuestionPollStatus(pollId: QuestionPollRecord["id"], status: QuestionPoll["status"]) {
   const updated = await updateDBRecord<QuestionPoll>("QUESTION_POLLS", pollId, {
      status,
   });
   return updated;
}

export async function submitQuestionPollAnswer({
   pollId,
   optionId,
   userId,
}: {
   pollId: QuestionPollRecord["id"];
   optionId: QuestionPollOptionRecord["id"];
   userId?: UserRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();

   // Prevent duplicate answers for the same user (if user identified)
   if (userId) {
      const existing = await getUserAnswerForPoll(pollId, userId);
      if (existing) return existing;
   }

   const answer = await createDBRecord<QuestionPollAnswer>("QUESTION_POLL_ANSWERS", {
      organization: organization.id,
      questionPoll: pollId,
      user: userId,
      optionSelected: optionId,
   });

   return answer;
}

export async function getUserAnswerForPoll(pollId: QuestionPollRecord["id"], userId: UserRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      questionPoll = {:pollId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         pollId,
         userId,
      },
   );

   const answer = await getSingleDBRecord<QuestionPollAnswer>("QUESTION_POLL_ANSWERS", filter);
   return answer;
}

export async function getAllQuestionPollAnswers(questionPollId: QuestionPollRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      questionPoll = {:questionPollId}
   `,
      {
         organizationId: organization.id,
         questionPollId: questionPollId,
      },
   );

   const answers = await getFullDBRecordsList<QuestionPollAnswer>("QUESTION_POLL_ANSWERS", {
      filter,
   });
   return answers;
}

export interface QuestionPollResultsItem {
   option: QuestionPollOptionRecord;
   votes: number;
   percentage: number;
}

export async function getQuestionPollResults(pollId: QuestionPollRecord["id"]) {
   const options = await getQuestionPollOptions(pollId);

   const organization = await getOrganizationFromSubdomain();
   const answersFilter = pbFilter(
      `
      organization = {:organizationId} &&
      questionPoll = {:pollId}
   `,
      {
         organizationId: organization.id,
         pollId,
      },
   );

   const answers = await getFullDBRecordsList<QuestionPollAnswer>("QUESTION_POLL_ANSWERS", {
      filter: answersFilter,
   });

   const totalVotes = answers.length;
   const votesByOption = new Map<string, number>();
   options.forEach((option) => votesByOption.set(option.id, 0));
   answers.forEach((answer) => {
      const current = votesByOption.get(answer.optionSelected) ?? 0;
      votesByOption.set(answer.optionSelected, current + 1);
   });

   const results: QuestionPollResultsItem[] = options.map((option) => {
      const votes = votesByOption.get(option.id) ?? 0;
      const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
      return {
         option,
         votes,
         percentage,
      };
   });

   return {
      totalVotes,
      results,
   };
}
