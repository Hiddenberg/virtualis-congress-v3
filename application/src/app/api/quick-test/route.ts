import { NextResponse } from "next/server";
import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export async function GET() {
   const congress = await getLatestCongress();
   const productsWithPrices = await getAllCongressProductsWithPrices(congress.id);
   return NextResponse.json({
      productsWithPrices,
   });
}
