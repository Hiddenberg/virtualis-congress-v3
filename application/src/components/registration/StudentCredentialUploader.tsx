"use client";

import { Check, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";

function UploadStudentCredentialButton() {
   const [fileSelected, setFileSelected] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const acceptedFileTypes = "image/jpeg,image/png,application/pdf";
   const maxSizeMB = 5;

   const { setStudentCredentialFile } = useDynamicFormContext();

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setError(null);

      if (file) {
         // Check file type
         const fileType = file.type;
         if (!acceptedFileTypes.includes(fileType)) {
            setError("Tipo de archivo no válido. Por favor, seleccione un archivo JPG, PNG o PDF.");
            setFileSelected(false);
            setStudentCredentialFile(null);
            return;
         }

         // Check file size
         if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB.`);
            setFileSelected(false);
            setStudentCredentialFile(null);
            return;
         }

         setStudentCredentialFile(file);
         setFileSelected(true);
      }
   };

   const handleButtonClick = () => {
      fileInputRef.current?.click();
   };

   return (
      <div className="relative space-y-2">
         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" />
         <button
            type="button"
            onClick={handleButtonClick}
            className={`flex items-center justify-center w-full py-3 rounded-xl font-medium transition-colors ${
               fileSelected ? "bg-green-500 text-white" : error ? "bg-red-500 text-white" : "bg-white text-black"
            }`}
         >
            {fileSelected ? (
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
         <p className="text-gray-300 text-sm">Formatos aceptados: JPG, PNG, PDF. Tamaño máximo: {maxSizeMB}MB</p>
      </div>
   );
}

export default function StudentCredentialUploader() {
   return (
      <div className="mt-8">
         <p>Sube tu comprobante de estudiante o residente para obtener un descuento</p>
         <UploadStudentCredentialButton />
      </div>
   );
}
