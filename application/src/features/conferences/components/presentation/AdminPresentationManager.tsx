"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { unlinkPresentationFromConferenceAction } from "@/features/conferences/actions/conferencePresentationActions";
import DownloadPresentationFileButton from "@/features/pptPresentations/components/DownloadPresentationFileButton";

export default function AdminPresentationManager({
   conferenceId,
   presentation,
}: {
   conferenceId: string;
   presentation?: PresentationRecord;
}) {
   const [isUnlinking, startTransition] = useTransition();

   const handleUnlink = () => {
      if (!presentation) return;
      const confirmed = window.confirm("¿Desvincular la presentación actual?");
      if (!confirmed) return;
      startTransition(async () => {
         const res = await unlinkPresentationFromConferenceAction({
            conferenceId,
         });
         if (!res.success) {
            toast.error(res.errorMessage);
            return;
         }
         toast.success("Presentación desvinculada");
      });
   };

   return (
      <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
         {presentation ? (
            <div className="flex justify-between items-center">
               <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{presentation.name}</p>
               </div>
               <DownloadPresentationFileButton presentation={presentation} />
               <button
                  onClick={handleUnlink}
                  disabled={isUnlinking}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 px-3 py-2 rounded-md text-white text-sm"
               >
                  {isUnlinking ? "Desvinculando..." : "Desvincular"}
               </button>
            </div>
         ) : (
            <p className="text-gray-600 text-sm">No hay presentación vinculada actualmente.</p>
         )}
      </div>
   );
}
