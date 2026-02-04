"use client";

import { LinkIcon } from "lucide-react";
import { CopyButton } from "@/components/global/Buttons";

export default function CopyCameraCallLinkButton() {
   const cameraCallUrl = `${window.location.origin}/congress-admin/camera-call`;

   return (
      <div className="space-y-2">
         <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="font-medium text-gray-700 text-xs">Link de la llamada de cámara</span>
         </div>
         <div className="flex items-center gap-3 bg-gray-50 px-4 py-1 border border-gray-200 rounded-lg max-w-80">
            <span className="flex-1 min-w-0 text-gray-700 text-sm truncate" title={cameraCallUrl}>
               {cameraCallUrl}
            </span>
            <CopyButton text={cameraCallUrl} />
         </div>
      </div>
   );
}
