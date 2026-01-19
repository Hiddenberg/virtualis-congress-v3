import { NextResponse } from "next/server";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { SpeakerDataRecord } from "@/types/congress";

export async function GET(
   _request: Request,
   { params }: { params: Promise<{ conferenceId: string }> },
): Promise<
   NextResponse<BackendResponse<{ conferenceSpeakers: SpeakerDataRecord[] }>>
> {
   try {
      const { conferenceId } = await params;

      const conferenceSpeakers = await getConferenceSpeakers(conferenceId);

      return NextResponse.json({
         success: true,
         data: {
            conferenceSpeakers,
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
            errorMessage: "Error al obtener los ponentes de la conferencia",
         },
         {
            status: 500,
         },
      );
   }
}
