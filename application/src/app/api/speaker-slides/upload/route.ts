import { type NextRequest, NextResponse } from "next/server";
import { uploadSpeakerSlidesFile } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get("file");
      const conferenceId = formData.get("conferenceId") as string | null;

      if (!(file instanceof File)) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "Archivo requerido",
            },
            {
               status: 400,
            },
         );
      }

      if (!conferenceId || !conferenceId.trim()) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "ID de conferencia requerido",
            },
            {
               status: 400,
            },
         );
      }

      const speakerSlidesFile = await uploadSpeakerSlidesFile({
         fileName: file.name,
         conferenceId,
         file,
      });

      return NextResponse.json({
         success: true,
         data: { speakerSlidesFile },
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error desconocido al subir el archivo";
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
