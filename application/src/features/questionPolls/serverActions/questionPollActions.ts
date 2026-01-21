"use server";

import { revalidatePath } from "next/cache";
import { linkQuestionPollToConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createQuestionPoll, submitQuestionPollAnswer } from "@/features/questionPolls/services/questionPollServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { dbBatch, getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export async function createQuestionPollAndLinkToConferenceAction({
   conferenceId,
   question,
   options,
}: {
   conferenceId: CongressConferenceRecord["id"];
   question: string;
   options: string[];
}): Promise<
   BackendResponse<{
      poll: QuestionPollRecord;
      options: QuestionPollOptionRecord[];
   }>
> {
   try {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) {
         return {
            success: false,
            errorMessage: "La pregunta es requerida",
         };
      }

      const sanitizedOptions = options.map((opt) => opt.trim()).filter((opt) => opt.length > 0);

      const uniqueOptions = Array.from(new Set(sanitizedOptions));

      if (uniqueOptions.length < 2) {
         return {
            success: false,
            errorMessage: "Agrega al menos dos opciones válidas",
         };
      }

      const { poll, options: createdOptions } = await createQuestionPoll(trimmedQuestion, uniqueOptions);

      await linkQuestionPollToConference(conferenceId, poll.id);

      revalidatePath("/preparation/[conferenceId]/question-polls", "page");

      return {
         success: true,
         data: {
            poll,
            options: createdOptions,
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
         errorMessage: "No se pudo crear la encuesta",
      };
   }
}

export async function deleteQuestionPollAction({
   conferenceId,
   pollId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   pollId: QuestionPollRecord["id"];
}): Promise<BackendResponse<null>> {
   try {
      const organization = await getOrganizationFromSubdomain();

      // Collect related records
      const linksFilter = pbFilter(
         `
         organization = {:organizationId} &&
         questionPoll = {:pollId}
      `,
         {
            organizationId: organization.id,
            pollId,
         },
      );
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
      const optionsFilter = pbFilter(
         `
         organization = {:organizationId} &&
         questionPoll = {:pollId}
      `,
         {
            organizationId: organization.id,
            pollId,
         },
      );

      const [linkRecords, answerRecords, optionRecords] = await Promise.all([
         getFullDBRecordsList<ConferenceQuestionPoll>("CONFERENCE_QUESTION_POLLS", {
            filter: linksFilter,
         }),
         getFullDBRecordsList<QuestionPollAnswer>("QUESTION_POLL_ANSWERS", {
            filter: answersFilter,
         }),
         getFullDBRecordsList<QuestionPollOption>("QUESTION_POLL_OPTIONS", {
            filter: optionsFilter,
         }),
      ]);

      // Batch delete: answers, options, links, then poll itself
      const batch = dbBatch();

      answerRecords.forEach((r) => batch.collection(PB_COLLECTIONS.QUESTION_POLL_ANSWERS).delete(r.id));
      optionRecords.forEach((r) => batch.collection(PB_COLLECTIONS.QUESTION_POLL_OPTIONS).delete(r.id));
      linkRecords.forEach((r) => batch.collection(PB_COLLECTIONS.CONFERENCE_QUESTION_POLLS).delete(r.id));
      batch.collection(PB_COLLECTIONS.QUESTION_POLLS).delete(pollId);

      await batch.send();

      revalidatePath(`/preparation/${conferenceId}/question-polls`);

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
         errorMessage: "No se pudo eliminar la encuesta",
      };
   }
}

export async function submitQuestionPollAnswerAction({
   pollId,
   optionId,
   revalidateUrl,
}: {
   pollId: QuestionPollRecord["id"];
   optionId: QuestionPollOptionRecord["id"];
   revalidateUrl?: string;
}): Promise<BackendResponse<{ answer: QuestionPollAnswerRecord }>> {
   try {
      const userId = await getLoggedInUserId();
      const answer = await submitQuestionPollAnswer({
         pollId,
         optionId,
         userId: userId ?? undefined,
      });

      if (revalidateUrl) {
         revalidatePath(revalidateUrl);
      }

      return {
         success: true,
         data: {
            answer,
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
         errorMessage: "No se pudo registrar tu respuesta",
      };
   }
}
