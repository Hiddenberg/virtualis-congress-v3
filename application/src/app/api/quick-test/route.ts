import { NextResponse } from "next/server";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getAllCourtesyInvitationsWithUsersNames } from "@/features/courtesyInvitations/services/courtesyInvitationServices";

export async function GET() {
   // const congressRegistrationDetails = await getCongressUserRegistrationsDetailsOptimized();
   const congress = await getLatestCongress();
   return NextResponse.json({
      message: "Hello World",
      test: await getAllCourtesyInvitationsWithUsersNames(congress.id),
   });
}
