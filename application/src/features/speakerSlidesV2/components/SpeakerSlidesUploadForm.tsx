/** biome-ignore-all lint/a11y/noStaticElementInteractions: Drag and drop file upload requires interactive div */
"use client";

import { AlertCircle, Check, CloudUpload, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";

interface SpeakerSlidesUploadFormProps {
   conferenceId: string;
   conferenceTitle: string;
   congressTitle: string;
   speakerNames: string[];
   maxFileSizeMB?: number;
   acceptedFileTypes?: string[];
}

const DEFAULT_MAX_FILE_SIZE_MB = 90;
// const DEFAULT_ACCEPTED_FILE_TYPES = [
//    "application/pdf",
//    "application/vnd.ms-powerpoint",
//    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//    ".pdf",
//    ".ppt",
//    ".pptx",
// ];

function UploadConfirmationPopup({
   fileName,
   fileSize,
   conferenceTitle,
   congressTitle,
   speakerNames,
   onConfirm,
   onCancel,
}: {
   fileName: string;
   fileSize: string;
   conferenceTitle: string;
   congressTitle: string;
   speakerNames: string[];
   onConfirm: () => void;
   onCancel: () => void;
}) {
   return (
      <div className="flex flex-col items-center gap-6 mx-auto px-2 py-4 max-w-2xl">
         <div className="flex justify-center items-center bg-blue-50 rounded-full w-16 h-16">
            <AlertCircle className="w-8 h-8 text-blue-500" />
         </div>

         <h1 className="font-bold text-gray-900 text-2xl text-center">Confirma que seleccionaste la conferencia correcta</h1>

         <div className="space-y-4 w-full">
            <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
               <div>
                  <span className="font-semibold text-gray-700 text-xl">Conferencia:</span>{" "}
                  <span className="text-blue-900 text-xl">{conferenceTitle}</span>
               </div>
               {speakerNames.length > 0 && (
                  <div>
                     <span className="font-semibold text-gray-700 text-xl">Ponente(s):</span>{" "}
                     <span className="text-blue-900 text-xl">{speakerNames.join(", ")}</span>
                  </div>
               )}
               <div>
                  <span className="font-semibold text-gray-700">Congreso:</span>{" "}
                  <span className="text-gray-900">{congressTitle}</span>
               </div>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
               <div>
                  <span className="font-semibold text-gray-700">Archivo:</span> <span className="text-gray-900">{fileName}</span>
               </div>
               <div>
                  <span className="font-semibold text-gray-700">Tamaño:</span> <span className="text-gray-900">{fileSize}</span>
               </div>
            </div>

            <p className="text-gray-700 text-center">¿Estás seguro de que quieres subir este archivo para esta conferencia?</p>
         </div>

         <div className="flex flex-wrap justify-center items-center gap-3 mt-2 w-full">
            <Button variant="secondary" onClick={onCancel} className="min-w-[140px]">
               Cancelar
            </Button>
            <Button variant="blue" onClick={onConfirm} className="min-w-[140px]">
               Confirmar y subir
            </Button>
         </div>
      </div>
   );
}

export function SpeakerSlidesUploadForm({
   conferenceId,
   conferenceTitle,
   congressTitle,
   speakerNames,
   maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
   // acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
}: SpeakerSlidesUploadFormProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [dragActive, setDragActive] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isUploading, startTransition] = useTransition();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const router = useRouter();
   const { showInPopUp, closePopUp } = useGlobalPopUpContext();

   const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

   const validateFile = (file: File): boolean => {
      setError(null);

      // Check file size
      if (file.size > maxFileSizeBytes) {
         setError(`El archivo es demasiado grande. El tamaño máximo permitido es ${maxFileSizeMB}MB.`);
         return false;
      }

      // Check file type
      // const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      // const isValidType = acceptedFileTypes.some(
      //    (type) => file.type === type || fileExtension === type || file.type.includes(type.replace(".", "")),
      // );

      // if (!isValidType) {
      //    setError("Tipo de archivo no válido. Se aceptan archivos PDF, PPT y PPTX.");
      //    return false;
      // }

      return true;
   };

   const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && validateFile(file)) {
         setSelectedFile(file);
      }
   };

   const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0];
      if (file && validateFile(file)) {
         setSelectedFile(file);
      }
   };

   const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(true);
   };

   const handleDragLeave = () => {
      setDragActive(false);
   };

   const removeFile = () => {
      setSelectedFile(null);
      setError(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const performUpload = () => {
      if (!selectedFile) {
         toast.error("Por favor selecciona un archivo para subir");
         return;
      }

      closePopUp();

      startTransition(async () => {
         toast.loading("Subiendo archivo...");

         try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("conferenceId", conferenceId);

            const response = await fetch("/api/speaker-slides/upload", {
               method: "POST",
               body: formData,
            });

            const result = await response.json();
            toast.dismiss();

            if (!result.success) {
               toast.error(result.errorMessage || "Error al subir el archivo");
               return;
            }

            toast.success("Archivo subido correctamente");
            router.push(`/speakers/slides/${conferenceId}/confirmation`);
            router.refresh();
         } catch {
            toast.dismiss();
            toast.error("Error al subir el archivo. Por favor intenta de nuevo.");
         }
      });
   };

   const handleUpload = () => {
      if (!selectedFile) {
         toast.error("Por favor selecciona un archivo para subir");
         return;
      }

      showInPopUp(
         <UploadConfirmationPopup
            fileName={selectedFile.name}
            fileSize={formatFileSize(selectedFile.size)}
            conferenceTitle={conferenceTitle}
            congressTitle={congressTitle}
            speakerNames={speakerNames}
            onConfirm={performUpload}
            onCancel={() => closePopUp()}
         />,
      );
   };

   const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
   };

   const openFileDialog = () => {
      fileInputRef.current?.click();
   };

   const handleKeyDown = (event: React.KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && !selectedFile) {
         event.preventDefault();
         openFileDialog();
      }
   };

   return (
      <div className="space-y-6">
         <div className="bg-white p-6 border border-gray-200 rounded-xl">
            <div className="space-y-4 mb-6">
               <h2 className="font-semibold text-gray-900 text-xl">Subir Presentación</h2>

               <div className="bg-blue-50 p-5 border border-blue-200 rounded-lg">
                  <div className="space-y-2">
                     <h3 className="mb-4 font-bold text-gray-900 text-xl">
                        Conferencia: <span className="text-blue-600">{conferenceTitle}</span>
                     </h3>
                     {speakerNames.length > 0 && (
                        <div>
                           <span className="font-semibold text-gray-700 text-xl">Ponente(s):</span>{" "}
                           <span className="text-blue-900 text-xl">{speakerNames.join(", ")}</span>
                        </div>
                     )}
                     <div>
                        <span className="font-semibold text-gray-700">Congreso:</span>{" "}
                        <span className="text-gray-900">{congressTitle}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div
               className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                  dragActive
                     ? "border-blue-500 bg-blue-50"
                     : selectedFile
                       ? "border-green-400 bg-green-50"
                       : "border-gray-300 bg-gray-50 hover:border-gray-400"
               }`}
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onClick={!selectedFile ? openFileDialog : undefined}
               onKeyDown={!selectedFile ? handleKeyDown : undefined}
               role={!selectedFile ? "button" : undefined}
               tabIndex={!selectedFile ? 0 : undefined}
            >
               <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelected}
                  className="hidden"
                  disabled={isUploading}
                  // accept={acceptedFileTypes.filter((type) => type.startsWith(".")).join(",")}
               />

               {selectedFile ? (
                  <div className="flex justify-between items-center">
                     <div className="flex flex-1 items-center gap-4 min-w-0">
                        <div className="shrink-0">
                           <div className="flex justify-center items-center bg-green-100 rounded-lg w-12 h-12">
                              <Check className="w-6 h-6 text-green-600" />
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="mb-1 font-medium text-gray-900 truncate">{selectedFile.name}</p>
                           <p className="text-gray-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                        </div>
                     </div>
                     <button
                        type="button"
                        onClick={removeFile}
                        className="hover:bg-gray-100 ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isUploading}
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>
               ) : (
                  <div className="text-center">
                     <CloudUpload className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                     <p className="mb-1 font-medium text-gray-700">
                        <span className="text-blue-600 hover:text-blue-700">Haz clic para seleccionar</span> o arrastra y suelta
                     </p>
                     <p className="text-gray-500 text-sm">Archivos PDF, PPT o PPTX</p>
                     <p className="mt-2 text-gray-400 text-xs">Tamaño máximo: {maxFileSizeMB}MB</p>
                  </div>
               )}
            </div>

            {error && (
               <div className="bg-red-50 mt-4 p-3 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
               </div>
            )}

            {selectedFile && (
               <div className="flex gap-3 pt-4">
                  <button
                     type="button"
                     onClick={handleUpload}
                     disabled={isUploading}
                     className="flex flex-1 justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  >
                     {isUploading ? (
                        <>
                           <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                           Subiendo...
                        </>
                     ) : (
                        <>
                           <Upload className="w-5 h-5" />
                           Subir Presentación
                        </>
                     )}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
