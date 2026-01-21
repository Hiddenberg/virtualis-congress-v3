"use client";

import { AlertTriangle, RotateCcw, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { acceptRecordingAction, rejectRecordingAction } from "../serverActions/recordingsActions";

export function ReviewRecordingButtons() {
   const [accepting, startAcceptTransition] = useTransition();
   const [rejecting, startRejectTransaction] = useTransition();
   const router = useRouter();

   const { recordingId } = useParams();

   if (!recordingId || typeof recordingId !== "string") {
      return (
         <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
               <AlertTriangle className="size-5" />
               <span className="font-medium">Error: ID de grabación no encontrado</span>
            </div>
         </div>
      );
   }

   const handleAcceptRecording = () => {
      startAcceptTransition(async () => {
         const acceptResponse = await acceptRecordingAction(recordingId);
         if (!acceptResponse.success) {
            toast.error(acceptResponse.errorMessage);
            return;
         }

         toast.success("Grabación guardada correctamente");
         router.push(`/recordings/record/${recordingId}/recording-saved`);
      });
   };

   const handleRecordAgain = () => {
      // Show confirmation dialog
      const confirmed = window.confirm(
         "¿Estás seguro de que quieres volver a grabar? Se eliminará la grabación actual y no se puede deshacer.",
      );

      if (!confirmed) return;

      startRejectTransaction(async () => {
         const rejectResponse = await rejectRecordingAction(recordingId);
         if (!rejectResponse.success) {
            toast.error(rejectResponse.errorMessage);
            return;
         }

         toast.success("Grabación eliminada correctamente");
         router.replace(`/recordings/record/${recordingId}/`);
      });
   };

   const isLoading = accepting || rejecting;

   return (
      <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
         <Button
            disabled={isLoading}
            onClick={handleAcceptRecording}
            loading={accepting}
            variant="green"
            className="px-8 py-3 w-full sm:w-auto font-semibold text-xl"
         >
            <Save className="size-5" />
            {accepting ? "Guardando grabación..." : "Guardar grabación"}
         </Button>

         <Button
            disabled={isLoading}
            onClick={handleRecordAgain}
            loading={rejecting}
            variant="destructive"
            className="px-8 py-3 w-full sm:w-auto font-semibold text-sm"
         >
            <RotateCcw className="size-5" />
            {rejecting ? "Eliminando grabación..." : "Volver a grabar"}
         </Button>
      </div>
   );
}
