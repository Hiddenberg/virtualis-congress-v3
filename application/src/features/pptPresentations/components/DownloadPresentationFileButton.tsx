"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/global/Buttons";
import pbClient from "@/libs/pbClient";

export default function DownloadPresentationFileButton({ presentation }: { presentation: PresentationRecord }) {
   const downloadLink = pbClient.files.getURL(presentation, presentation.file as string);
   return (
      <Button
         onClick={() => {
            window.open(downloadLink, "_blank");
         }}
         variant="blue"
      >
         <DownloadIcon className="w-4 h-4" />
         Descargar archivo original
      </Button>
   );
}
