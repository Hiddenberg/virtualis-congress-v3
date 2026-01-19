"use client";

import {
   AlertCircle,
   Check,
   FileText,
   Loader2,
   TrashIcon,
   Upload,
} from "lucide-react";
import { DragEvent, useRef, useState, useTransition } from "react";
import { Button } from "@/components/global/Buttons";
import { SlideImage } from "../services/convertapiServices";
import SlidesShower from "./SlidesShower";

export default function UploadPresentationForm({
   onPresentationSaved,
}: {
   onPresentationSaved: ({
      presentation,
      presentationSlides,
   }: {
      presentation: PresentationRecord;
      presentationSlides: PresentationSlideRecord[];
   }) => void;
}) {
   const [presentationFile, setPresentationFile] = useState<File | null>(null);
   const [converting, startTransition] = useTransition();
   const [saving, startSaveTransition] = useTransition();
   const [isDragOver, setIsDragOver] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [slideImages, setSlideImages] = useState<SlideImage[] | null>(null);
   const [presentationName, setPresentationName] = useState("");
   const [hasVideo, setHasVideo] = useState<boolean | null>(null);
   const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(
      null,
   );
   const fileInputRef = useRef<HTMLInputElement>(null);
   // const { recordingId } = useParams()
   // const effectiveRecordingId = (typeof recordingIdProp === "string" && recordingIdProp) || (typeof recordingId === "string" ? recordingId : undefined)

   const validateFile = (file: File): boolean => {
      const validTypes = [
         "application/vnd.ms-powerpoint",
         "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      const validExtensions = [".ppt", ".pptx"];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (file.size > maxSize) {
         setError(
            "El archivo es muy grande. El tamaño máximo permitido es 50MB.",
         );
         return false;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (
         !validExtensions.includes(fileExtension) &&
         !validTypes.includes(file.type)
      ) {
         setError(
            "Formato de archivo no válido. Solo se permiten archivos .ppt y .pptx.",
         );
         return false;
      }

      setError(null);
      return true;
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
         setPresentationFile(file);
      }
   };

   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
         const file = files[0];
         if (validateFile(file)) {
            setPresentationFile(file);
         }
      }
   };

   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
   };

   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
   };

   const handleConvertPresentation = () => {
      if (!presentationFile) return;
      if (hasVideo === null) {
         setError("Por favor indícanos si tu diapositiva tiene videos.");
         return;
      }
      startTransition(async () => {
         try {
            const form = new FormData();
            form.append("file", presentationFile);
            form.append("format", "webp");
            const response = await fetch("/api/presentations/convert", {
               method: "POST",
               body: form,
            });
            const result: BackendResponse<SlideImage[]> = await response.json();
            if (result.success) {
               setSlideImages(result.data);
               setPresentationName(
                  presentationFile.name.replace(/\.(pptx|ppt)$/i, ""),
               );
            } else {
               setError(result.errorMessage);
            }
         } catch (error) {
            console.error(error);
            setError(
               "Error al convertir la diapositiva. Por favor, inténtalo de nuevo.",
            );
         }
      });
   };

   const handleSavePresentation = () => {
      if (!presentationFile || !slideImages) {
         setError("No se puede guardar la diapositiva sin convertirla primero");
         return;
      }
      if (hasVideo === null) {
         setError("Por favor indícanos si tu diapositiva tiene videos.");
         return;
      }

      setError(null);
      setSaveSuccessMessage(null);
      const name = (
         presentationName || presentationFile.name.replace(/\.(pptx|ppt)$/i, "")
      ).trim();
      if (!name) {
         setError("El nombre de la diapositiva es requerido");
         return;
      }
      startSaveTransition(async () => {
         const form = new FormData();
         form.append("name", name);
         form.append("file", presentationFile);
         form.append("slides", JSON.stringify(slideImages));
         form.append("hasVideo", String(hasVideo));

         const response = await fetch("/api/presentations", {
            method: "POST",
            body: form,
         });
         const savePresentationResult: BackendResponse<{
            presentation: PresentationRecord;
            presentationSlides: PresentationSlideRecord[];
         }> = await response.json();
         if (!savePresentationResult.success) {
            setError(
               savePresentationResult.errorMessage ||
                  "Error al guardar la diapositiva",
            );
            return;
         }

         setSaveSuccessMessage("Diapositiva guardada correctamente");
         onPresentationSaved({
            presentation: savePresentationResult.data.presentation,
            presentationSlides: savePresentationResult.data.presentationSlides,
         });
      });
   };

   const openFileDialog = () => {
      fileInputRef.current?.click();
   };

   const removeFile = () => {
      setPresentationFile(null);
      setError(null);
      setHasVideo(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
   };

   if (slideImages) {
      return (
         <div className="!bg-gradient-to-br !from-gray-50 !to-gray-100 !py-4 !min-h-screen">
            <div className="!mx-auto !px-6 !max-w-7xl">
               {/* Save presentation section */}
               <div className="!bg-white !shadow-xl !mb-4 !p-6 !border !border-gray-200 !rounded-2xl">
                  <h3 className="!mb-2 !font-semibold !text-gray-900 !text-lg">
                     Guardar diapositiva
                  </h3>
                  <p className="!mb-3 !text-gray-500">
                     Puedes revisar tu diapositiva en la parte de abajo antes de
                     guardarla.
                  </p>
                  <div className="!flex !sm:flex-row !flex-col !items-start !sm:items-end !gap-3">
                     <div className="!w-full !sm:w-96">
                        <label
                           htmlFor="presentation-name"
                           className="!block !mb-1 !font-medium !text-gray-700 !text-sm"
                        >
                           Nombre
                        </label>
                        <input
                           id="presentation-name"
                           type="text"
                           value={presentationName}
                           onChange={(e) => setPresentationName(e.target.value)}
                           placeholder="Ej. Presentación magistral"
                           className="!px-3 !py-2 !border !border-gray-300 !focus:border-yellow-400 !rounded-md !focus:outline-none !focus:ring-1 !focus:ring-yellow-400 !w-full !transition-colors"
                        />
                        <p className="!mt-1 !text-gray-400 !text-xs">
                           Si lo dejas vacío, usaremos el nombre del archivo.
                        </p>
                     </div>

                     <div className="!flex !items-center !gap-3">
                        <Button
                           onClick={handleSavePresentation}
                           disabled={saving}
                           variant="green"
                           className="!flex !items-center !gap-2 !px-6 !py-3 !rounded-md !focus:outline-none !focus:ring-2 !focus:ring-green-500 !focus:ring-offset-2 !font-medium !text-white !transition-colors !disabled:cursor-not-allowed"
                        >
                           {saving ? (
                              <>
                                 <Loader2 className="!w-4 !h-4 !animate-spin" />
                                 Guardando...
                              </>
                           ) : (
                              "Guardar diapositiva"
                           )}
                        </Button>

                        <Button
                           onClick={() => {
                              setSlideImages(null);
                              setPresentationFile(null);
                              setError(null);
                              setPresentationName("");
                              setHasVideo(null);
                              setSaveSuccessMessage(null);
                              if (fileInputRef.current) {
                                 fileInputRef.current.value = "";
                              }
                           }}
                           variant="destructive"
                           disabled={saving}
                           className="!px-6 !py-3 !rounded-md !focus:outline-none !focus:ring-2 !focus:ring-yellow-500 !focus:ring-offset-2 !font-medium !transition-colors"
                        >
                           <TrashIcon className="!w-4 !h-4" />
                           Usar otra diapositiva
                        </Button>
                     </div>
                  </div>

                  {saveSuccessMessage && (
                     <p className="!mt-3 !text-green-700 !text-sm">
                        {saveSuccessMessage}
                     </p>
                  )}

                  {error && (
                     <div className="!bg-red-50 !mt-3 !p-3 !border !border-red-200 !rounded-lg">
                        <div className="!flex !items-center !gap-2">
                           <AlertCircle className="!w-5 !h-5 !text-red-500" />
                           <p className="!text-red-700 !text-sm">{error}</p>
                        </div>
                     </div>
                  )}
               </div>

               {/* Slides Shower Component */}
               <SlidesShower slideImages={slideImages} />
            </div>
         </div>
      );
   }

   return (
      <div className="!mx-auto !p-6 !max-w-2xl">
         {/* Header */}
         <div className="!mb-8 !text-center">
            {/* <div className="!inline-flex !justify-center !items-center !bg-yellow-100 !mb-4 !rounded-full !w-16 !h-16">
               <Upload className="!w-8 !h-8 !text-yellow-600" />
            </div> */}
            <h1 className="!mb-2 !font-bold !text-gray-900 !text-3xl">
               Subir Diapositiva
            </h1>
            <p className="!text-gray-600">
               Sube tu diapositiva de PowerPoint al sistema
            </p>
         </div>

         {/* Upload Area */}
         <div className="!bg-white !shadow-xl !border !border-gray-200 !rounded-2xl !overflow-hidden">
            <div
               className={`!relative !border-2 !border-dashed !rounded-xl !m-6 !p-8 !transition-all !duration-300 ${
                  isDragOver
                     ? "!border-yellow-400 !bg-yellow-50"
                     : presentationFile
                       ? "!border-green-300 !bg-green-50"
                       : "!border-gray-300 hover:!border-yellow-400 hover:!bg-yellow-50"
               }`}
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onClick={!presentationFile ? openFileDialog : undefined}
            >
               <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pptx,.ppt"
                  onChange={handleFileChange}
                  className="!hidden"
               />

               {!presentationFile ? (
                  <div className="!text-center !cursor-pointer">
                     <div
                        className={`!inline-flex !items-center !justify-center !w-12 !h-12 !rounded-full !mb-4 !transition-colors ${
                           isDragOver ? "!bg-yellow-200" : "!bg-gray-100"
                        }`}
                     >
                        <Upload
                           className={`!w-6 !h-6 ${isDragOver ? "!text-yellow-600" : "!text-gray-400"}`}
                        />
                     </div>
                     <h3 className="!mb-2 !font-semibold !text-gray-900 !text-lg">
                        {isDragOver
                           ? "Suelta el archivo aquí"
                           : "Arrastra tu diapositiva aquí"}
                     </h3>
                     <p className="!mb-4 !text-gray-500">
                        o haz clic para seleccionar un archivo
                     </p>
                     <p className="!text-gray-400 !text-sm">
                        Formatos soportados: .ppt, .pptx (máx. 50MB)
                     </p>
                  </div>
               ) : (
                  <div className="!text-center">
                     <div className="!inline-flex !justify-center !items-center !bg-green-100 !mb-4 !rounded-full !w-12 !h-12">
                        <Check className="!w-6 !h-6 !text-green-600" />
                     </div>
                     <h3 className="!mb-2 !font-semibold !text-gray-900 !text-lg">
                        Archivo seleccionado
                     </h3>
                     <div className="!bg-white !mx-auto !p-4 !border !border-green-200 !rounded-lg !max-w-md">
                        <div className="!flex !items-center !gap-3">
                           <FileText className="!w-8 !h-8 !text-blue-500" />
                           <div className="!flex-1 !text-left">
                              <p className="!font-medium !text-gray-900 !truncate">
                                 {presentationFile.name}
                              </p>
                              <p className="!text-gray-500 !text-sm">
                                 {formatFileSize(presentationFile.size)}
                              </p>
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={removeFile}
                        className="!mt-3 !text-gray-500 hover:!text-gray-700 !text-sm !underline"
                     >
                        Seleccionar otro archivo
                     </button>
                  </div>
               )}
            </div>

            {/* Has Video Question */}
            {presentationFile && (
               <div className="!mx-6 !mt-10 !mb-4">
                  <label className="!block !mb-2 !font-semibold !text-gray-700 !text-lg !text-center">
                     ¿Tu diapositiva incluye videos?
                  </label>
                  <div className="!flex !justify-center !gap-2">
                     <button
                        type="button"
                        onClick={() => {
                           setHasVideo(true);
                           setError(null);
                        }}
                        className={`!px-4 !py-2 !rounded-md !border ${hasVideo === true ? "!bg-blue-600 !text-white !border-blue-600" : "!bg-white !text-gray-700 !border-gray-300 hover:!bg-gray-50"}`}
                     >
                        Sí
                     </button>
                     <button
                        type="button"
                        onClick={() => {
                           setHasVideo(false);
                           setError(null);
                        }}
                        className={`!px-4 !py-2 !rounded-md !border ${hasVideo === false ? "!bg-blue-600 !text-white !border-blue-600" : "!bg-white !text-gray-700 !border-gray-300 hover:!bg-gray-50"}`}
                     >
                        No
                     </button>
                  </div>
               </div>
            )}

            {/* Error Message */}
            {error && (
               <div className="!bg-red-50 !mx-6 !mb-6 !p-4 !border !border-red-200 !rounded-lg">
                  <div className="!flex !items-center !gap-2">
                     <AlertCircle className="!w-5 !h-5 !text-red-500" />
                     <p className="!text-red-700 !text-sm">{error}</p>
                  </div>
               </div>
            )}

            {/* Action Buttons */}
            <div className="!bg-gray-50 !p-6 !border-gray-200 !border-t">
               <div className="!flex !justify-center !gap-3">
                  {presentationFile && (
                     <button
                        onClick={handleConvertPresentation}
                        disabled={
                           converting || !presentationFile || hasVideo === null
                        }
                        className="!flex !justify-center !items-center !gap-2 !bg-green-600 hover:!bg-green-700 disabled:!bg-gray-300 !px-8 !py-3 !rounded-md focus:!outline-none !focus:ring-2 !focus:ring-green-500 !focus:ring-offset-2 !min-w-[200px] !font-semibold !text-white !text-lg !transition-colors cursor-not-allowed"
                     >
                        {converting ? (
                           <>
                              <Loader2 className="!w-5 !h-5 !animate-spin" />
                              Subiendo...
                           </>
                        ) : (
                           <>
                              <Upload className="!w-5 !h-5" />
                              Subir Diapositiva
                           </>
                        )}
                     </button>
                  )}
               </div>

               {presentationFile && (
                  <p
                     className={`!mt-4 text-gray-500 !text-lg !text-center ${converting ? "!animate-pulse !duration-75 !text-blue-500" : ""}`}
                  >
                     Esto puede tardar hasta unos minutos dependiendo del tamaño
                     del archivo{converting ? ", por favor espera..." : ""}
                  </p>
               )}
            </div>
         </div>

         {/* Help Text */}
         <div className="!mt-6 !text-center">
            <p className="!text-gray-500 !text-sm">
               Tu diapositiva será convertida a imágenes PNG de alta calidad.
            </p>
         </div>
      </div>
   );
}
