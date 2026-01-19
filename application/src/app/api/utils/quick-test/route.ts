import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
   if (process.env.NODE_ENV !== "development") {
      notFound();
      return;
   }

   return NextResponse.json({
      message: "Emails sent",
   });
}
