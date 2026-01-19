import RecorderInterface from "@/components/recorder/RecorderInterface";
import { ScreenRecorderContextProvider } from "@/contexts/ScreenRecorderContext";
import { getExpandedRecordingById } from "@/services/recordingServices";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ConferenceRecordingPage({
   params,
   searchParams,
}: {
   params: Promise<{ recordingId: string }>;
   searchParams: SearchParams;
}) {
   const { recordingId } = await params;
   const { language } = await searchParams;

   const expandedRecording = await getExpandedRecordingById(recordingId);

   const texts = {
      "en-US": {
         notFound: "Recording not found",
         recordingOf: "Record presentation for the conference:",
      },
      "es-MX": {
         notFound: "Grabación no encontrada",
         recordingOf: "Grabar presentación de la conferencia:",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (!expandedRecording) {
      return (
         <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="font-bold text-3xl">{currentTexts.notFound}</h1>
         </div>
      );
   }

   return (
      <div className="flex flex-col justify-center items-center">
         <h1 className="max-w-screen-lg text-center">
            <p className="text-xl">{currentTexts.recordingOf}</p>
            <p className="font-bold text-2xl">
               {expandedRecording.expand.conference.title}
            </p>
         </h1>

         <ScreenRecorderContextProvider isPresentation={true}>
            <RecorderInterface language={(language as string) || "es-MX"} />
         </ScreenRecorderContextProvider>
      </div>
   );
}
