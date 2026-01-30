import { NextResponse } from "next/server";
import { listDriveFiles } from "@/features/googleDrive/services/googleDriveServices";

export async function GET() {
   const files = await listDriveFiles();
   return NextResponse.json({
      files,
   });
}
