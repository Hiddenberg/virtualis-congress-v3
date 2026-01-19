import { type NextRequest, NextResponse } from "next/server";
import { convertPPTToImages } from "@/features/pptPresentations/services/convertapiServices";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get("file");
      const format = (formData.get("format") as string) || "webp";

      if (!(file instanceof File)) {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "Archivo no enviado",
            },
            {
               status: 400,
            },
         );
      }

      if (format !== "png" && format !== "webp") {
         return NextResponse.json(
            {
               success: false,
               errorMessage: "Formato inválido",
            },
            {
               status: 400,
            },
         );
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
         start: async (controller) => {
            const keepAlive = setInterval(() => {
               controller.enqueue(encoder.encode(" "));
            }, 10000);
            try {
               const slideImages = await convertPPTToImages(file, format);
               const payload = JSON.stringify({
                  success: true,
                  data: slideImages,
               });
               controller.enqueue(encoder.encode(payload));
            } catch (error) {
               const message =
                  error instanceof Error
                     ? error.message
                     : "Error al convertir la presentación";
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
            : "Error al convertir la presentación";
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
