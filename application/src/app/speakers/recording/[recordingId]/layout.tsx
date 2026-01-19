// import MacOsDetectionPopUp from "@/components/global/MacOsDetectionPopUp"
import { RecordingCompletedPopUp } from "@/components/recorder/RecordingCompletedPopUp";
import SafariPopUp from "@/components/recorder/SafariPopUp";
import RecorderHeader from "@/components/speakers/recording/RecorderHeader";
import { checkIfRecordingWasCompleted } from "@/services/recordingServices";

export const dynamic = "force-dynamic";

export default async function SpeakersRecordingIdLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: Promise<{ recordingId: string }>;
}) {
   const { recordingId } = await params;
   const isRecordingCompleted = await checkIfRecordingWasCompleted(recordingId);

   return (
      <div className="py-4">
         <SafariPopUp />
         {/* <MacOsDetectionPopUp /> */}
         {isRecordingCompleted && <RecordingCompletedPopUp />}
         <RecorderHeader />
         {children}
      </div>
   );
}
