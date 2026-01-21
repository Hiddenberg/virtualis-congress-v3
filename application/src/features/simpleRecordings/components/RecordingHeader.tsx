import { PlusIcon, VideoIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";

interface RecordingHeaderProps {
   recordingsCount: number;
}

export default function RecordingHeader({ recordingsCount }: RecordingHeaderProps) {
   return (
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-8">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-blue-200 p-2 rounded-lg">
                  <VideoIcon className="size-6 text-blue-700" />
               </div>
               <h1 className="font-light text-gray-900 text-2xl">Grabaciones creadas</h1>
            </div>
            <p className="text-gray-600 text-sm">
               {recordingsCount === 0
                  ? "No hay grabaciones disponibles"
                  : `${recordingsCount} grabación${recordingsCount > 1 ? "es" : ""} en total`}
            </p>
         </div>

         <LinkButton href="/recordings/create" className="flex-shrink-0">
            <PlusIcon className="size-5" />
            Programar grabación
         </LinkButton>
      </div>
   );
}
