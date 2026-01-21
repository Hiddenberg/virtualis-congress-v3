import { type NextRequest, NextResponse } from "next/server";
import { getTrackedEmailById, updateTrackedEmailRecord } from "../services/trackedEmailServices";

export async function trackedEmailEndpoint(req: NextRequest, { params }: { params: Promise<{ trackedEmailId: string }> }) {
   const { trackedEmailId } = await params;

   const trackedEmail = await getTrackedEmailById(trackedEmailId);

   const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64",
   );

   const pixelResponse = new NextResponse(pixel, {
      headers: {
         "Content-Type": "image/gif",
         "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
         Pragma: "no-cache",
         Expires: "0",
      },
   });

   if (!trackedEmail) {
      console.error(`[trackedEmailEndpoint] The email with id ${trackedEmailId} was not found`);
      return pixelResponse;
   }

   if (trackedEmail.status === "opened") {
      console.log(`[trackedEmailEndpoint] Tracked email ${trackedEmailId} was opened again at ${new Date().toISOString()}`);
      return pixelResponse;
   }

   if (trackedEmail.status === "sent") {
      await updateTrackedEmailRecord({
         trackedEmailId,
         updatedData: {
            status: "opened",
            openedAt: new Date().toISOString(),
         },
      });
      console.log(`[trackedEmailEndpoint] Tracked email ${trackedEmailId} was opened`);
   }

   return pixelResponse;
}
