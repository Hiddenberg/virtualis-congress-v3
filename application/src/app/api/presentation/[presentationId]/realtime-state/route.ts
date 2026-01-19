import { type NextRequest, NextResponse } from "next/server";
import {
   ensureRealtimePresentationState,
   updateRealtimePresentationStateByPresentationId,
} from "@/features/pptPresentations/services/realtimePresentationServices";

export async function GET(
   _request: NextRequest,
   { params }: { params: Promise<{ presentationId: string }> },
) {
   try {
      const { presentationId } = await params;
      if (!presentationId)
         return NextResponse.json(
            {
               error: "presentationId is required",
            },
            {
               status: 400,
            },
         );

      const state = await ensureRealtimePresentationState(presentationId);
      return NextResponse.json(state);
   } catch (error) {
      const message =
         error instanceof Error ? error.message : "Unexpected error";
      return NextResponse.json(
         {
            error: message,
         },
         {
            status: 500,
         },
      );
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ presentationId: string }> },
) {
   try {
      const { presentationId } = await params;
      if (!presentationId)
         return NextResponse.json(
            {
               error: "presentationId is required",
            },
            {
               status: 400,
            },
         );

      const body = await request.json();
      const allowed: Partial<
         Pick<
            RealtimePresentationState,
            "currentSlideIndex" | "isHidden" | "userControlling"
         >
      > = {};
      if (typeof body.currentSlideIndex === "number")
         allowed.currentSlideIndex = body.currentSlideIndex;
      if (typeof body.isHidden === "boolean") allowed.isHidden = body.isHidden;
      if (
         typeof body.userControlling === "string" ||
         body.userControlling === null
      )
         allowed.userControlling = body.userControlling;

      const updated = await updateRealtimePresentationStateByPresentationId(
         presentationId,
         allowed,
      );
      return NextResponse.json(updated);
   } catch (error) {
      const message =
         error instanceof Error ? error.message : "Unexpected error";
      return NextResponse.json(
         {
            error: message,
         },
         {
            status: 500,
         },
      );
   }
}
