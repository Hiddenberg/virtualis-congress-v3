"use client";

import { VideoIcon } from "lucide-react";
import { useTransition } from "react";
import { assignQnALivestreamSessionsToAllConferencesAction } from "@/actions/livestreamActions";

export default function AssignQnASessionsToAllConferencesButton() {
   const [isLoading, startTransition] = useTransition();

   const handleClick = () => {
      startTransition(async () => {
         const { message, skippedConferences, preparedConferences, updatedConferences, errorConferences } =
            await assignQnALivestreamSessionsToAllConferencesAction();

         console.log(message);
         console.log(skippedConferences);
         console.log(preparedConferences);
         console.log(updatedConferences);
         console.log(errorConferences);

         alert(message);
      });
   };

   return (
      <button
         onClick={handleClick}
         disabled={isLoading}
         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 px-4 py-2 rounded-md text-white transition-colors disabled:animate-pulse disabled:cursor-not-allowed"
      >
         <VideoIcon size={18} />
         <span>{isLoading ? "Asignando sesiones de QnA..." : "Asignar sesiones de QnA a todas las conferencias"}</span>
      </button>
   );
}
