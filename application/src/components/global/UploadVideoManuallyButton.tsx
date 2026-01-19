import MuxUploader from "@mux/mux-uploader-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
   completeManualUploadAction,
   createMuxUploadUrlAction,
} from "@/actions/muxActions";
import { updateRecordingStatusAction } from "@/actions/recordingActions";
import { createVideoAssetAction } from "@/actions/videoAssetActions";
import { deleteAllVideoAssetsForRecordingAction } from "@/features/conferences/actions/conferenceActions";

export default function UploadVideoManuallyButton({
   language = "es-MX",
}: {
   language?: string;
}) {
   const [uploadId, setUploadId] = useState<string | null>(null);
   const [videoAssetId, setVideoAssetId] = useState<string | null>(null);
   const [isUploading, setIsUploading] = useState(false);

   const { recordingId } = useParams();
   const router = useRouter();

   if (!recordingId) {
      return null;
   }

   const texts = {
      "en-US": {
         uploading: "Uploading video...",
         uploadError: "Could not create upload URL",
         completeError: "Could not complete the upload",
         success: "Video uploaded successfully",
         button: "Upload MP4 file",
      },
      "es-MX": {
         uploading: "Subiendo video...",
         uploadError: "No se pudo crear la URL de subida",
         completeError: "No se pudo completar la subida",
         success: "Video subido correctamente",
         button: "Subir archivo MP4",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   return (
      <div className="flex flex-col justify-center items-center">
         {isUploading && (
            <p className="font-semibold text-2xl animate-pulse">
               {currentTexts.uploading}
            </p>
         )}

         <MuxUploader
            noDrop
            dynamicChunkSize
            endpoint={async () => {
               const {
                  url,
                  error,
                  id: muxUploadId,
               } = await createMuxUploadUrlAction(recordingId as string);
               if (error) {
                  alert(error);
                  return "";
               }

               if (!url) {
                  alert(currentTexts.uploadError);
                  return "";
               }

               // Updating the recording status to uploading
               await updateRecordingStatusAction(
                  recordingId as string,
                  "uploading",
               );

               // Deleting all previous video assets for this conference
               await deleteAllVideoAssetsForRecordingAction(
                  recordingId as string,
               );

               const {
                  videoAsset: combinedVideoAsset,
                  error: combinedVideoAssetError,
               } = await createVideoAssetAction(
                  recordingId as string,
                  muxUploadId,
                  "combined",
               );

               if (!combinedVideoAsset) {
                  alert(combinedVideoAssetError);
                  return "";
               }

               setVideoAssetId(combinedVideoAsset.id);
               setUploadId(muxUploadId);
               return url;
            }}
            onSuccess={async () => {
               setIsUploading(false);

               if (!uploadId) {
                  alert(currentTexts.completeError);
                  return;
               }

               if (!videoAssetId) {
                  alert("[HowToRecordOnZoomPopUp] Video asset id not found");
                  return;
               }

               const { error, success } = await completeManualUploadAction(
                  uploadId,
                  recordingId as string,
                  videoAssetId,
               );

               if (error) {
                  alert(error);
                  return;
               }

               if (success) {
                  alert(currentTexts.success);
                  router.push(
                     `/speakers/recording/upload-confirmation${language === "en-US" ? "?language=en-US" : "?language=es-MX"}`,
                  );
               }
            }}
            onUploadError={(error) => {
               alert(error);
               setIsUploading(false);
            }}
            onUploadStart={() => {
               setIsUploading(true);
            }}
         >
            <button
               type="button"
               slot="file-select"
               className="bg-green-400 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold text-white text-xl"
            >
               {currentTexts.button}
            </button>
         </MuxUploader>
      </div>
   );
}
