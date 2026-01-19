"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { Button } from "../global/Buttons";

function UploadButton() {
   const [optionSelected, setOptionSelected] = useState<"cmim" | "smne" | null>(
      null,
   );
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const acceptedFileTypes = "image/jpeg,image/png,application/pdf";
   const maxSizeMB = 5;

   const { setCMIMFile, cmimFile } = useDynamicFormContext();

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setError(null);

      if (file) {
         // Check file type
         const fileType = file.type;
         if (!acceptedFileTypes.includes(fileType)) {
            setError(
               "Tipo de archivo no válido. Por favor, seleccione un archivo JPG, PNG o PDF.",
            );
            setCMIMFile(null);
            return;
         }

         // Check file size
         if (file.size > maxSizeMB * 1024 * 1024) {
            setError(
               `El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB.`,
            );
            setCMIMFile(null);
            return;
         }

         setCMIMFile(file);
      }
   };

   const handleButtonClick = () => {
      fileInputRef.current?.click();
   };

   if (optionSelected === null && !cmimFile) {
      return (
         <div className="flex gap-2 w-full">
            <Button
               key="cmim"
               className="w-full"
               variant="primary"
               onClick={() => setOptionSelected("cmim")}
            >
               Comprobante CMIM
            </Button>
            <Button
               key="smne"
               className="w-full"
               variant="primary"
               onClick={() => setOptionSelected("smne")}
            >
               Comprobante SMNE
            </Button>
         </div>
      );
   }

   return (
      <div>
         <div className="flex items-center gap-2">
            <button
               onClick={() => {
                  setOptionSelected(null);
                  setCMIMFile(null);
               }}
            >
               <ArrowLeft className="w-6 h-6" />
            </button>
            <h1>
               Subir comprobante {optionSelected === "cmim" ? "CMIM" : "SMNE"}
            </h1>
         </div>
         <div className="relative space-y-2">
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               accept={acceptedFileTypes}
               className="hidden"
            />
            <button
               type="button"
               onClick={handleButtonClick}
               className={`flex items-center justify-center w-full py-3 rounded-xl font-medium transition-colors ${
                  cmimFile !== null
                     ? "bg-green-500 text-white"
                     : error
                       ? "bg-red-500 text-white"
                       : "bg-white text-black"
               }`}
            >
               {cmimFile !== null ? (
                  <>
                     <Check className="mr-2" size={20} />
                     Archivo seleccionado
                  </>
               ) : error ? (
                  <>
                     <X className="mr-2" size={20} />
                     Error
                  </>
               ) : (
                  "Seleccionar archivo"
               )}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-gray-300 text-sm">
               Formatos aceptados: JPG, PNG, PDF. Tamaño máximo: {maxSizeMB}MB
            </p>
         </div>
      </div>
   );
}

export default function CMIMCredentialUploader() {
   return (
      <div className="flex flex-col mt-8">
         <p className="mb-4 text-gray-300">
            Sube tu comprobante de membresía del CMIM o de la SMNE para obtener
            el precio preferencial por tu membresía
         </p>
         <UploadButton />
      </div>
   );
}
