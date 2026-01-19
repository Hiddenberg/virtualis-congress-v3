import { type NextRequest, NextResponse } from "next/server";
import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ conferenceId: string }> },
): Promise<
   NextResponse<BackendResponse<{ qnaSession: LivestreamSessionRecord | null }>>
> {
   try {
      const { conferenceId } = await params;

      const qnaSession = await getConferenceQnASession(conferenceId);

      return NextResponse.json({
         success: true,
         data: {
            qnaSession: qnaSession,
         },
      });
   } catch (error) {
      if (error instanceof Error) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: error.message,
            },
            {
               status: 500,
            },
         );
      }

      return NextResponse.json(
         {
            success: false,
            errorMessage:
               "Error al obtener la sesión de preguntas y respuestas",
         },
         {
            status: 500,
         },
      );
   }
}
