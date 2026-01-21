import { NextResponse } from "next/server";
import { getActiveQuestionPollForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getAllQuestionPollAnswers, getQuestionPollOptions } from "@/features/questionPolls/services/questionPollServices";

export async function GET(request: Request, { params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const activePoll = await getActiveQuestionPollForConference(conferenceId);
   if (!activePoll) {
      return NextResponse.json({
         data: null,
      });
   }

   const [questionPollOptions, questionPollAnswers] = await Promise.all([
      getQuestionPollOptions(activePoll.id),
      getAllQuestionPollAnswers(activePoll.id),
   ]);

   return NextResponse.json({
      data: {
         questionPoll: activePoll,
         questionPollOptions,
         questionPollAnswers,
      },
   });
}
