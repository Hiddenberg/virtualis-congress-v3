import { NextResponse } from "next/server";
import {
   getAllQuestionPollAnswers,
   getQuestionPollById,
   getQuestionPollOptions,
} from "@/features/questionPolls/services/questionPollServices";

export async function GET(_request: Request, { params }: { params: Promise<{ questionPollId: string }> }) {
   const { questionPollId } = await params;

   const [questionPoll, questionPollOptions, questionPollAnswers] = await Promise.all([
      getQuestionPollById(questionPollId),
      getQuestionPollOptions(questionPollId),
      getAllQuestionPollAnswers(questionPollId),
   ]);

   if (!questionPoll) {
      return NextResponse.json(
         {
            data: null,
         },
         {
            status: 404,
         },
      );
   }

   return NextResponse.json({
      data: {
         questionPoll,
         questionPollOptions,
         questionPollAnswers,
      },
   });
}
