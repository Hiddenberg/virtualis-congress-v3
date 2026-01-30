import { NextResponse } from "next/server";
import { listDriveFiles } from "@/libs/googleDrive";

export async function GET() {
   const files = await listDriveFiles();
   return NextResponse.json({
      files,
   });
}
