import { NextResponse } from "next/server";
import { getCongressUserRegistrationsDetailsOptimized } from "@/features/manualRegistration/services/manualRegistrationServices";

export async function GET() {
   const congressRegistrationDetails = await getCongressUserRegistrationsDetailsOptimized();

   return NextResponse.json({
      message: "Hello World",
      congressRegistrationDetails,
   });
}
