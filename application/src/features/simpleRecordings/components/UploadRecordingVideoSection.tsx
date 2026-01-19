"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { CloudUpload, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { createMuxUploadUrlAction } from "@/actions/muxActions";
import { completeManualRecordingVideoUploadAction } from "../serverActions/recordingsActions";

export default function UploadRecordingVideoSection({
   recordingId,
   redirectTo,
}: {
   recordingId: string;
   redirectTo?: string;
}) {
   const [isUpdatingRecording, startTransition] = useTransition();
   const uploadIdRef = useRef<string | null>(null);

   const router = useRouter();

   if (isUpdatingRecording) {
      return (
         <div className="bg-white shadow-sm p-6 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
               <Loader2 className="mt-0.5 size-5 text-blue-600 animate-spin" />
               <div>
                  <h2 className="font-semibold text-gray-900">
                     Subiendo video...
                  </h2>
                  <p className="mt-1 text-gray-600 text-sm">
                     Estamos procesando tu archivo. Esto puede tardar unos
                     minutos.
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
         <div className="mb-4">
            <div className="flex items-start gap-3">
               <CloudUpload className="mt-0.5 size-5 text-gray-700" />
               <div>
                  <h2 className="font-semibold text-gray-900">
                     Cargar archivo de video
                  </h2>
                  <p className="mt-1 text-gray-600 text-sm">
                     Formatos recomendados: MP4
                  </p>
               </div>
            </div>
         </div>

         <div className="rounded-lg overflow-hidden">
            <MuxUploader
               noDrop={true}
               endpoint={async () => {
                  const {
                     url,
                     error,
                     id: muxUploadId,
                  } = await createMuxUploadUrlAction(recordingId as string);

                  if (error) {
                     toast.error(error);
                     return "";
                  }

                  if (!url) {
                     toast.error("No se pudo crear la URL de subida");
                     return "";
                  }

                  uploadIdRef.current = muxUploadId;

                  return url;
               }}
               onError={() => {
                  toast.error("Error al subir el video");
               }}
               onSuccess={() => {
                  startTransition(async () => {
                     await completeManualRecordingVideoUploadAction(
                        recordingId,
                        uploadIdRef.current as string,
                     );
                     router.push(redirectTo || `/recordings/`);
                     toast.success("Video subido correctamente");
                  });
               }}
            >
               <button
                  type="button"
                  slot="file-select"
                  className="bg-green-400 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold text-white text-xl"
               >
                  Subir video
               </button>
            </MuxUploader>
         </div>

         <div className="flex items-start gap-2 mt-4 text-gray-500 text-xs">
            <Info className="mt-0.5 size-4" />
            <p>
               Al finalizar la subida, procesaremos el video automáticamente y
               te redirigiremos a la lista de grabaciones.
            </p>
         </div>
      </div>
   );
}
