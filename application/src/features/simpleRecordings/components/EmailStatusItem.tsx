"use client";

import { format } from "@formkit/tempo";
import { AlertCircleIcon, ChevronDownIcon, Loader2Icon, MailOpenIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import type { RecordingTrackedEmailWithType } from "../services/recordingTrackedEmailsServices";

interface EmailStatusItemProps {
   trackedEmail: RecordingTrackedEmailWithType;
}

export default function EmailStatusItem({ trackedEmail }: EmailStatusItemProps) {
   const [isExpanded, setIsExpanded] = useState(false);

   // Status configuration
   const statusConfig = {
      sending: {
         label: "Enviando",
         icon: Loader2Icon,
         color: "text-gray-600",
         bgColor: "bg-gray-50",
         borderColor: "border-gray-200",
         iconClass: "animate-spin",
      },
      sent: {
         label: "Enviado",
         icon: SendIcon,
         color: "text-blue-600",
         bgColor: "bg-blue-50",
         borderColor: "border-blue-200",
         iconClass: "",
      },
      opened: {
         label: "Abierto",
         icon: MailOpenIcon,
         color: "text-green-600",
         bgColor: "bg-green-50",
         borderColor: "border-green-200",
         iconClass: "",
      },
      errored: {
         label: "Error",
         icon: AlertCircleIcon,
         color: "text-red-600",
         bgColor: "bg-red-50",
         borderColor: "border-red-200",
         iconClass: "",
      },
   };

   const status = statusConfig[trackedEmail.status];
   const StatusIcon = status.icon;

   return (
      <button
         type="button"
         className={`w-full text-left ${status.bgColor} border ${status.borderColor} rounded-lg overflow-hidden transition-all duration-200 hover:shadow-sm cursor-pointer`}
         onClick={() => setIsExpanded(!isExpanded)}
      >
         {/* Compact View - Always Visible */}
         <div className="flex justify-between items-center gap-2 p-2.5">
            {/* Left: Type and Subject */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 text-xs shrink-0">
                     {trackedEmail.type === "invitation" ? "Invitación" : "Recordatorio"}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <p className="text-gray-800 text-xs truncate" title={trackedEmail.subject}>
                     {trackedEmail.subject}
                  </p>
               </div>
            </div>

            {/* Right: Status and Expand Icon */}
            <div className="flex items-center gap-2 shrink-0">
               <div className="flex items-center gap-1">
                  <StatusIcon className={`size-3.5 ${status.color} ${status.iconClass}`} />
                  <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
               </div>
               <ChevronDownIcon
                  className={`size-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
               />
            </div>
         </div>

         {/* Expanded Details */}
         {isExpanded && (
            <div className="mt-1 px-2.5 pt-0 pb-2.5 border-gray-200/50 border-t">
               <div className="space-y-1 mt-2 text-gray-500 text-xs">
                  {trackedEmail.status === "opened" && trackedEmail.openedAt && (
                     <div className="flex items-center gap-1">
                        <span className="font-medium">Abierto:</span>
                        <span>
                           {format({
                              date: trackedEmail.openedAt,
                              format: "DD/MM/YYYY hh:mm A",
                              locale: "es-MX",
                              tz: "America/Mexico_City",
                           })}
                        </span>
                     </div>
                  )}
                  {(trackedEmail.status === "sent" || trackedEmail.status === "opened") && trackedEmail.sentAt && (
                     <div className="flex items-center gap-1">
                        <span className="font-medium">Enviado:</span>
                        <span>
                           {format({
                              date: trackedEmail.sentAt,
                              format: "DD/MM/YYYY hh:mm A",
                              locale: "es-MX",
                              tz: "America/Mexico_City",
                           })}
                        </span>
                     </div>
                  )}
                  {trackedEmail.status === "errored" && trackedEmail.errorMessage && (
                     <div className="flex items-start gap-1">
                        <span className="font-medium">Error:</span>
                        <span className="flex-1">{trackedEmail.errorMessage}</span>
                     </div>
                  )}
               </div>
            </div>
         )}
      </button>
   );
}
