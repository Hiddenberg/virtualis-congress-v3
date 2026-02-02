import { format } from "@formkit/tempo";
import { ExternalLink, FileTextIcon, PlusIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import { LinkButton } from "@/components/global/Buttons";
import GoBackButton from "@/components/global/GoBackButton";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import DeleteSpeakerSlidesFileButton from "@/features/speakerSlidesV2/components/DeleteSpeakerSlidesFileButton";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";
import type { SpeakerSlidesFileRecord } from "@/features/speakerSlidesV2/types/speakerSlidesTypes";

function SpeakerSlidesFileListItem({ file, isLatest }: { file: SpeakerSlidesFileRecord; isLatest: boolean }) {
   const googleDriveUrl = `https://drive.google.com/file/d/${file.googleDriveFileId}/view`;

   const formattedDate = format({
      date: file.created,
      format: "DD MMMM YYYY, hh:mm A",
      tz: "America/Mexico_City",
      locale: "es-MX",
   });

   return (
      <div
         className={`flex items-center justify-between gap-4 bg-white shadow-sm hover:shadow-md p-4 border rounded-xl transition-all ${
            isLatest ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
         }`}
      >
         <div className="flex flex-1 items-center gap-4 min-w-0">
            <div
               className={`flex justify-center items-center rounded-lg w-12 h-12 shrink-0 ${isLatest ? "bg-blue-50" : "bg-gray-50"}`}
            >
               <FileTextIcon className={`w-6 h-6 ${isLatest ? "text-blue-600" : "text-gray-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{file.fileName}</h3>
                  {isLatest && (
                     <span className="bg-blue-100 px-2 py-0.5 rounded-md font-medium text-blue-700 text-xs whitespace-nowrap">
                        Más reciente
                     </span>
                  )}
               </div>
               <div className="flex flex-wrap items-center gap-4">
                  <p className="text-gray-500 text-sm">Tamaño: {file.fileSizeInMb} MB</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-500 text-sm">Subido: {formattedDate}</p>
               </div>
            </div>
         </div>
         <div className="shrink-0 *:w-full flex flex-col gap-2">
            <LinkButton href={googleDriveUrl} target="_blank" variant="blue" className="whitespace-nowrap">
               <ExternalLink className="w-4 h-4" />
               Abrir en Google Drive
            </LinkButton>
            <DeleteSpeakerSlidesFileButton fileId={file.id} />
         </div>
      </div>
   );
}

export default async function SpeakerSlidesFilesPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div>
            <GoBackButton backURL="/congress-admin/conferences" backButtonText="Volver a conferencias" className="mb-4" />
            <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
               <h1 className="font-bold text-gray-900 text-2xl">Conferencia no encontrada</h1>
            </div>
         </div>
      );
   }

   const speakerSlidesFiles = await getSpeakerSlidesFilesByConferenceId(conferenceId);

   return (
      <div>
         <GoBackButton backURL="/congress-admin/conferences" backButtonText="Volver a conferencias" className="mb-4" />
         <AdminSubPageHeader
            title={`Presentaciones de la conferencia "${conference.title}"`}
            Icon={FileTextIcon}
            description={`Archivos subidos para esta conferencia`}
            sideElement={
               <LinkButton href={`/speakers/slides/${conferenceId}/upload`} target="_blank" className="mx-auto" variant="blue">
                  <PlusIcon className="w-4 h-4" />
                  Subir archivo para esta conferencia
               </LinkButton>
            }
         />

         {speakerSlidesFiles.length > 0 ? (
            <div className="space-y-3">
               {speakerSlidesFiles.map((file, index) => (
                  <SpeakerSlidesFileListItem key={file.id} file={file} isLatest={index === 0} />
               ))}
            </div>
         ) : (
            <div className="bg-white shadow-sm p-12 border border-gray-200 rounded-xl">
               <div className="flex flex-col justify-center items-center text-center">
                  <div className="flex justify-center items-center bg-gray-100 mb-4 rounded-full w-16 h-16">
                     <FileTextIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">No hay archivos de presentaciones</h3>
                  <p className="mb-6 max-w-md text-gray-600 text-sm">
                     No se han subido archivos de presentaciones para esta conferencia aún.
                  </p>
               </div>
            </div>
         )}
      </div>
   );
}
