/** biome-ignore-all lint/a11y/noStaticElementInteractions: sadas */
"use client";

import { Check, CloudUpload, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface GoogleDriveFileUploadFormProps {
   driveFolderId: string;
   onUploadSuccess?: (fileId: string) => void;
}

export default function GoogleDriveFileUploadForm({ driveFolderId, onUploadSuccess }: GoogleDriveFileUploadFormProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [dragActive, setDragActive] = useState(false);
   const [isUploading, startTransition] = useTransition();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         setSelectedFile(file);
      }
   };

   const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
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
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const handleUpload = () => {
      if (!selectedFile) {
         toast.error("Please select a file to upload");
         return;
      }

      startTransition(async () => {
         toast.loading("Uploading file...");

         const formData = new FormData();
         formData.append("file", selectedFile);
         formData.append("driveFolderId", driveFolderId);

         try {
            const response = await fetch("/api/google-drive/upload", {
               method: "POST",
               body: formData,
            });

            const result: BackendResponse<{ fileId: string }> = await response.json();

            toast.dismiss();

            if (!result.success) {
               toast.error(result.errorMessage);
               return;
            }

            toast.success("File uploaded successfully");
            setSelectedFile(null);
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }

            if (onUploadSuccess && result.data) {
               onUploadSuccess(result.data.fileId);
            }
         } catch (error) {
            toast.dismiss();
            toast.error("Failed to upload file. Please try again.");
         }
      });
   };

   const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
   };

   return (
      <div className="space-y-4">
         <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
               dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
         >
            <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" disabled={isUploading} />

            {selectedFile ? (
               <div className="flex justify-between items-center">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                     <Check className="w-5 h-5 text-green-500 shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-gray-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                     </div>
                  </div>
                  <button
                     type="button"
                     onClick={removeFile}
                     className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                     disabled={isUploading}
                  >
                     <X className="w-5 h-5" />
                  </button>
               </div>
            ) : (
               <div className="text-center">
                  <CloudUpload className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <p className="mb-1 text-gray-600">
                     <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="font-medium text-blue-600 hover:text-blue-700"
                        disabled={isUploading}
                     >
                        Click to upload
                     </button>{" "}
                     or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">Any file type</p>
               </div>
            )}
         </div>

         {selectedFile && (
            <div className="flex gap-3">
               <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-4 py-2 rounded-lg font-medium text-white transition-colors"
               >
                  {isUploading ? "Uploading..." : "Upload to Google Drive"}
               </button>
            </div>
         )}
      </div>
   );
}
