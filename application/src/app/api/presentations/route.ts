import { NextRequest, NextResponse } from "next/server";
import { savePresentationAndSlides } from "@/features/pptPresentations/services/presentationServices";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const name = (formData.get("name") as string) || "";
      const hasVideoRaw = (formData.get("hasVideo") as string) || "false";
      const file = formData.get("file");
      const slidesRaw = formData.get("slides") as string | null;

      if (!name.trim()) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "El nombre es requerido",
            },
            {
               status: 400,
            },
         );
      }
      if (!(file instanceof File)) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "Archivo de presentación requerido",
            },
            {
               status: 400,
            },
         );
      }
      if (!slidesRaw) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "No hay diapositivas para guardar",
            },
            {
               status: 400,
            },
         );
      }

      const slides = JSON.parse(slidesRaw);
      const hasVideo = hasVideoRaw === "true";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
         start: async (controller) => {
            const keepAlive = setInterval(() => {
               controller.enqueue(encoder.encode(" "));
            }, 10000);
            try {
               const result = await savePresentationAndSlides({
                  name,
                  file: file as File,
                  slides,
                  hasVideo,
               });
               const payload = JSON.stringify({
                  success: true,
                  data: result,
               });
               controller.enqueue(encoder.encode(payload));
            } catch (error) {
               const message =
                  error instanceof Error
                     ? error.message
                     : "Error al guardar la presentación";
               const payload = JSON.stringify({
                  success: false,
                  errorMessage: message,
               });
               controller.enqueue(encoder.encode(payload));
            } finally {
               clearInterval(keepAlive);
               controller.close();
            }
         },
      });

      return new Response(stream, {
         headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
         },
      });
   } catch (error) {
      const message =
         error instanceof Error
            ? error.message
            : "Error al guardar la presentación";
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
