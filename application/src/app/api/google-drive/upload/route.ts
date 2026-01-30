import { type NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/features/googleDrive/services/googleDriveServices";

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get("file");
      const driveFolderId = formData.get("driveFolderId") as string | null;

      if (!(file instanceof File)) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "File is required",
            },
            {
               status: 400,
            },
         );
      }

      if (!driveFolderId || !driveFolderId.trim()) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "Drive folder ID is required",
            },
            {
               status: 400,
            },
         );
      }

      const fileId = await uploadFileToDrive({
         file,
         driveFolderId,
      });

      return NextResponse.json({
         success: true,
         data: { fileId },
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred while uploading the file";
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
