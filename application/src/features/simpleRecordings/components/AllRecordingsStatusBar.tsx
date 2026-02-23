import { CheckCircleIcon, ClockIcon, TrendingUpIcon, VideoIcon } from "lucide-react";
import type { SimpleRecording } from "../types/recordingsTypes";

export default function AllRecordingsStatusBar({ allRecordings }: { allRecordings: SimpleRecording[] }) {
   const completedRecordings = allRecordings.filter((recording) => recording.status === "ready");
   const pendingRecordings = allRecordings.filter((recording) => recording.status !== "ready");
   const totalRecordings = allRecordings.length;

   const completionRate = totalRecordings > 0 ? Math.round((completedRecordings.length / totalRecordings) * 100) : 0;

   const statusMetrics = [
      {
         label: "Total",
         value: totalRecordings,
         icon: VideoIcon,
         color: "text-gray-600",
         bgColor: "bg-gray-50",
      },
      {
         label: "Completadas",
         value: completedRecordings.length,
         icon: CheckCircleIcon,
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         label: "Pendientes",
         value: pendingRecordings.length,
         icon: ClockIcon,
         color: "text-yellow-600",
         bgColor: "bg-yellow-50",
      },
      {
         label: "Progreso",
         value: `${completionRate}%`,
         icon: TrendingUpIcon,
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
   ];

   if (totalRecordings === 0) {
      return null;
   }

   return (
      <div className="mb-6 border-gray-200">
         <div className="p-4">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-6">
                  {statusMetrics.map((metric) => (
                     <div key={metric.label} className="flex items-center gap-3">
                        <div className={`${metric.bgColor} p-2 rounded-lg`}>
                           <metric.icon className={`size-5 ${metric.color}`} />
                        </div>
                        <div>
                           <div className="font-medium text-gray-900 text-sm">{metric.value}</div>
                           <div className="text-gray-500 text-xs">{metric.label}</div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Progress Bar */}
               <div className="flex items-center gap-3">
                  <div className="text-right">
                     <div className="font-medium text-gray-900 text-sm">{completionRate}% completado</div>
                     <div className="text-gray-500 text-xs">
                        {completedRecordings.length} de {totalRecordings}
                     </div>
                  </div>
                  <div className="bg-gray-200 rounded-full w-32 h-2">
                     <div
                        className="bg-green-500 rounded-full h-2 transition-all duration-300"
                        style={{
                           width: `${completionRate}%`,
                        }}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
