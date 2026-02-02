import { format } from "@formkit/tempo";
import { ExternalLink, FileTextIcon, PlusIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";
import type { SpeakerSlidesFileRecord } from "@/features/speakerSlidesV2/types/speakerSlidesTypes";

function SpeakerSlidesFileItem({ file, isLatest }: { file: SpeakerSlidesFileRecord; isLatest: boolean }) {
   const googleDriveUrl = `https://drive.google.com/file/d/${file.googleDriveFileId}/view`;

   const formattedDate = format({
      date: file.created,
      format: "DD MMMM YYYY, hh:mm A",
      tz: "America/Mexico_City",
      locale: "es-MX",
   });

   return (
      <div
         className={`flex items-center justify-between gap-4 p-3 rounded-md transition-colors ${
            isLatest ? "bg-blue-50 ring-1 ring-blue-200" : "bg-gray-50 ring-1 ring-gray-200"
         }`}
      >
         <div className="flex flex-1 items-center gap-3 min-w-0">
            <div
               className={`flex justify-center items-center rounded-lg w-10 h-10 shrink-0 ${isLatest ? "bg-blue-100" : "bg-gray-100"}`}
            >
               <FileTextIcon className={`w-5 h-5 ${isLatest ? "text-blue-600" : "text-gray-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{file.fileName}</h3>
                  {isLatest && (
                     <span className="bg-blue-100 px-1.5 py-0.5 rounded font-medium text-blue-700 text-xs whitespace-nowrap shrink-0">
                        Más reciente
                     </span>
                  )}
               </div>
               <div className="flex flex-wrap items-center gap-3">
                  <p className="text-gray-500 text-xs">Tamaño: {file.fileSizeInMb} MB</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-500 text-xs">Subido: {formattedDate}</p>
               </div>
            </div>
         </div>
         <div className="shrink-0">
            <LinkButton href={googleDriveUrl} target="_blank" variant="blue" className="whitespace-nowrap text-xs px-3 py-1.5">
               <ExternalLink className="w-3.5 h-3.5" />
               Abrir en Drive
            </LinkButton>
         </div>
      </div>
   );
}

export default async function ConferencePresentationSlidesSection({ conferenceId }: { conferenceId: string }) {
   const speakerSlidesFiles = await getSpeakerSlidesFilesByConferenceId(conferenceId);

   if (speakerSlidesFiles.length === 0) {
      return null;
   }

   return (
      <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
         <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
               <FileTextIcon className="w-5 h-5 text-gray-600" />
               <h2 className="font-semibold text-gray-900 text-base">Archivos de presentación</h2>
            </div>
            <LinkButton
               target="_blank"
               href={`/speakers/slides/${conferenceId}/upload`}
               variant="blue"
               className="whitespace-nowrap text-xs px-3 py-1.5"
            >
               <PlusIcon className="w-3.5 h-3.5" />
               Subir archivo
            </LinkButton>
         </div>
         <div className="space-y-2">
            {speakerSlidesFiles.map((file, index) => (
               <SpeakerSlidesFileItem key={file.id} file={file} isLatest={index === 0} />
            ))}
         </div>
      </section>
   );
}
