"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

interface SelfContainedPollData {
   questionPoll: QuestionPollRecord;
   questionPollOptions: QuestionPollOptionRecord[];
   questionPollAnswers: QuestionPollAnswerRecord[];
}

export function useConferenceActiveQuestionPollRealtime(
   conferenceId: string | null,
) {
   const { organization } = useOrganizationContext();
   const [data, setData] = useState<SelfContainedPollData | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   const orgId = organization?.id ?? null;
   const canRun = useMemo(
      () => Boolean(conferenceId && orgId),
      [conferenceId, orgId],
   );

   const isReloadingRef = useRef<boolean>(false);

   const reloadActive = async () => {
      if (!canRun || !conferenceId) return;
      if (isReloadingRef.current) return;
      isReloadingRef.current = true;
      setIsLoading(true);
      try {
         const links = await pbClient
            .collection(PB_COLLECTIONS.CONFERENCE_QUESTION_POLLS)
            .getFullList<
               ConferenceQuestionPollRecord & {
                  expand: { questionPoll: QuestionPollRecord };
               }
            >({
               filter: `conference = "${conferenceId}"`,
               expand: "questionPoll",
               sort: "-created",
            });

         const active = links.find(
            (l) => l.expand?.questionPoll?.status === "active",
         );
         if (!active) {
            setData(null);
            return;
         }

         const poll = active.expand.questionPoll;

         const [options, answers] = await Promise.all([
            pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLL_OPTIONS)
               .getFullList<QuestionPollOptionRecord>({
                  filter: `questionPoll = "${poll.id}"`,
                  sort: "created",
               }),
            pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLL_ANSWERS)
               .getFullList<QuestionPollAnswerRecord>({
                  filter: `questionPoll = "${poll.id}"`,
                  sort: "created",
               }),
         ]);

         setData({
            questionPoll: poll,
            questionPollOptions: options,
            questionPollAnswers: answers,
         });
      } finally {
         isReloadingRef.current = false;
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (!canRun) return;

      let unsubLink: (() => void) | undefined;
      let unsubPolls: (() => void) | undefined;
      let aborted = false;

      const run = async () => {
         await reloadActive();

         // If the set of linked polls for this conference changes, re-evaluate active
         unsubLink = await pbClient
            .collection(PB_COLLECTIONS.CONFERENCE_QUESTION_POLLS)
            .subscribe<ConferenceQuestionPollRecord>(
               "*",
               () => {
                  if (!aborted) reloadActive();
               },
               {
                  filter: `conference = "${conferenceId}"`,
               },
            );

         // If any poll in the organization changes (e.g., status toggled), re-evaluate active
         if (orgId) {
            unsubPolls = await pbClient
               .collection(PB_COLLECTIONS.QUESTION_POLLS)
               .subscribe<QuestionPollRecord>(
                  "*",
                  () => {
                     if (!aborted) reloadActive();
                  },
                  {
                     filter: `organization = "${orgId}"`,
                  },
               );
         }
      };

      run();

      return () => {
         aborted = true;
         if (unsubLink) unsubLink();
         if (unsubPolls) unsubPolls();
      };
   }, [canRun, conferenceId, orgId]);

   return {
      data,
      isLoading,
   };
}
