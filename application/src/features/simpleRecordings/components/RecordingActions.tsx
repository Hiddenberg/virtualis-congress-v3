"use client";

import {
   DownloadIcon,
   EyeIcon,
   // LinkIcon,
   MoreVerticalIcon,
   UploadIcon,
} from "lucide-react";
import { useState } from "react";
import {
   Button,
   // CopyButton,
   LinkButton,
} from "@/components/global/Buttons";
import DeleteRecordingButton from "./DeleteRecordingButton";

interface RecordingActionsProps {
   recording: SimpleRecordingRecord;
   recordingLink: string;
}

export default function RecordingActions({
   recording,
   // recordingLink
}: RecordingActionsProps) {
   const [showMoreActions, setShowMoreActions] = useState(false);

   return (
      <div className="relative">
         <div className="flex items-center gap-2">
            {/* Download Button */}
            {recording.muxDownloadURL && (
               <LinkButton
                  href={recording.muxDownloadURL}
                  variant="outline"
                  className="flex-1 border-gray-200 hover:border-gray-300 text-sm"
               >
                  <DownloadIcon className="size-4" />
                  Descargar
               </LinkButton>
            )}

            {/* More Actions Button */}
            <Button
               variant="outline"
               className="p-2 border-gray-200 hover:border-gray-300"
               onClick={() => setShowMoreActions(!showMoreActions)}
            >
               <MoreVerticalIcon className="size-4" />
            </Button>
         </div>

         {/* More Actions Dropdown */}
         {showMoreActions && (
            <div className="top-full right-0 z-10 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-lg w-64">
               <div className="space-y-2 p-3">
                  <span className="text-gray-600 text-sm">
                     Id: {recording.id}
                  </span>

                  {/* Upload Video Section */}
                  {recording.status !== "processing" &&
                     !recording.muxPlaybackId && (
                        <LinkButton
                           variant="blue"
                           href={`/recordings/recording/${recording.id}/upload-video`}
                        >
                           <UploadIcon className="size-4" />
                           Subir video
                        </LinkButton>
                     )}

                  <LinkButton
                     href={`/recordings/record/${recording.id}/review`}
                     variant="blue"
                     className="w-full text-sm"
                  >
                     <EyeIcon className="size-4" />
                     Ir a revisión
                  </LinkButton>

                  {/* Delete Section */}
                  {recording.status !== "processing" && (
                     <div className="pt-2">
                        <DeleteRecordingButton recordingId={recording.id} />
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* Click Outside to Close */}
         {showMoreActions && (
            <div
               className="z-[5] fixed inset-0"
               onClick={() => setShowMoreActions(false)}
            />
         )}
      </div>
   );
}
