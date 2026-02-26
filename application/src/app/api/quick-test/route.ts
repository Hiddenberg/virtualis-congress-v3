import { NextResponse } from "next/server";
import { getStripeCouponById } from "@/services/stripeServices";

export async function GET() {
   const stripeCouponCode = await getStripeCouponById("sdfsdf");

   return NextResponse.json({
      message: "Hello World",
      stripeCouponCode,
   });
}
