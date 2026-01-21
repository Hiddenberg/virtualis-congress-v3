import { type NextRequest, NextResponse } from "next/server";
import {
   linkPresentationToConference,
   unlinkPresentationFromConference,
} from "@/features/conferences/services/conferencePresentationsServices";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ conferenceId: string }> }) {
   try {
      const { conferenceId } = await params;
      const body = await _req.json();
      const presentationId = body?.presentationId as string | undefined;

      if (!conferenceId || !presentationId) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "conferenceId y presentationId son requeridos",
            },
            {
               status: 400,
            },
         );
      }

      await linkPresentationToConference(conferenceId, presentationId);
      return NextResponse.json({
         success: true,
         data: null,
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al vincular presentación";
      return NextResponse.json(
         {
            success: false,
            errorMessage: message,
         },
         {
            status: 500,
         },
      );
   }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ conferenceId: string }> }) {
   try {
      const { conferenceId } = await params;
      if (!conferenceId) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "conferenceId es requerido",
            },
            {
               status: 400,
            },
         );
      }

      await unlinkPresentationFromConference(conferenceId);
      return NextResponse.json({
         success: true,
         data: null,
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : "Error al desvincular presentación";
      return NextResponse.json(
         {
            success: false,
            errorMessage: message,
         },
         {
            status: 500,
         },
      );
   }
}
