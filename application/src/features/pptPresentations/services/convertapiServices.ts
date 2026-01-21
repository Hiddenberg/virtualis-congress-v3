import "server-only";
import { Readable } from "stream";
import convertapi from "@/libs/convertapi";

export interface SlideImage {
   fileName: string;
   url: string;
}

export async function convertPPTToImages(file: File, outputFormat: "png" | "webp"): Promise<SlideImage[]> {
   console.log("starting conversion");
   console.log("file type", file.type);

   const fileBuffer = await file.bytes();
   const readableStream = new Readable();
   readableStream.push(fileBuffer);
   readableStream.push(null);

   console.log("uploading file");
   const uploadResult = await convertapi.upload(readableStream, file.name);
   console.log("file uploaded");

   const webpConfigs = {
      TextAntialiasing: "4",
      GraphicsAntialiasing: "2",
   };

   console.log("converting file");
   const result = await convertapi.convert(
      outputFormat,
      {
         File: uploadResult,
         ...(outputFormat === "webp" ? webpConfigs : {}),
      },
      "ppt",
   );
   console.log("file converted");

   console.log("result files", result.files);

   return result.files.map((file) => ({
      fileName: file.fileName,
      url: file.url,
   }));
}
