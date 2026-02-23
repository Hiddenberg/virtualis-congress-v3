import { CheckCircle, Clock, Settings, Upload, Video, XCircle } from "lucide-react";
import type { SimpleRecording } from "../types/recordingsTypes";

interface RecordingStatusBadgeProps {
   status: SimpleRecording["status"];
}

export default function RecordingStatusBadge({ status }: RecordingStatusBadgeProps) {
   const statusConfig = {
      scheduled: {
         label: "Programada",
         variant: "outline" as const,
         icon: Clock,
         className: "border-blue-200 bg-blue-50 text-blue-700",
      },
      recording: {
         label: "Grabando",
         variant: "destructive" as const,
         icon: Video,
         className: "border-red-200 bg-red-50 text-red-700 animate-pulse",
      },
      uploading: {
         label: "Subiendo",
         variant: "outline" as const,
         icon: Upload,
         className: "border-yellow-200 bg-yellow-50 text-yellow-700",
      },
      processing: {
         label: "Procesando",
         variant: "outline" as const,
         icon: Settings,
         className: "border-purple-200 bg-purple-50 text-purple-700",
      },
      reviewing: {
         label: "Revisando",
         variant: "outline" as const,
         icon: Settings,
         className: "border-purple-200 bg-purple-50 text-purple-700",
      },
      ready: {
         label: "Lista",
         variant: "success" as const,
         icon: CheckCircle,
         className: "border-green-200 bg-green-50 text-green-700",
      },
      error: {
         label: "Error",
         variant: "destructive" as const,
         icon: XCircle,
         className: "border-red-200 bg-red-50 text-red-700",
      },
   };

   const config = statusConfig[status];
   const IconComponent = config.icon;

   return (
      <div className={`${config.className} flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium`}>
         <IconComponent className="size-3" />
         {config.label}
      </div>
   );
}
