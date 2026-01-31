"use client";

import { useState } from "react";
import GoogleDriveFileUploadForm from "@/features/googleDrive/components/GoogleDriveFileUploadForm";

export default function FileUploadPage() {
   const [driveFolderId, setDriveFolderId] = useState("");

   return (
      <div className="container mx-auto p-6 max-w-2xl">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Drive File Upload</h1>
            <div className="space-y-2">
               <label htmlFor="folderId" className="block text-sm font-medium text-gray-700">
                  Drive Folder ID
               </label>
               <input
                  id="folderId"
                  type="text"
                  value={driveFolderId}
                  onChange={(e) => setDriveFolderId(e.target.value)}
                  placeholder="Enter Google Drive folder ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               />
               <p className="text-sm text-gray-500">
                  You can find the folder ID in the Google Drive URL. For example, if the URL is
                  "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j", the folder ID is "1a2b3c4d5e6f7g8h9i0j".
               </p>
            </div>
         </div>

         {driveFolderId ? (
            <GoogleDriveFileUploadForm
               driveFolderId={driveFolderId}
               onUploadSuccess={(fileId) => {
                  console.log("File uploaded successfully with ID:", fileId);
               }}
            />
         ) : (
            <div className="text-center py-8 text-gray-500">Please enter a Drive Folder ID to start uploading files.</div>
         )}
      </div>
   );
}
