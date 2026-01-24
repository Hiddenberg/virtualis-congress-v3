import { Building2Icon, MonitorIcon } from "lucide-react";
import type { CongressLandingConfiguration } from "@/features/congresses/types/congressLandingConfigurationsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";

interface ModalityBadgeProps {
   modality: CongressRecord["modality"];
   colorScheme: CongressLandingConfiguration["colorScheme"];
}

interface ModalityBadgeColorClasses {
   badgeBgClass: string;
   badgeBorderClass: string;
   badgeTextClass: string;
   badgeIconClass: string;
   badgeGlowClass: string;
}

const colorClasses: Record<CongressLandingConfiguration["colorScheme"], ModalityBadgeColorClasses> = {
   green: {
      badgeBgClass: "bg-gradient-to-r from-green-50/30 via-emerald-50/30 to-green-50/30",
      badgeBorderClass: "border-green-200/50",
      badgeTextClass: "text-green-50",
      badgeIconClass: "text-green-100",
      badgeGlowClass: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
   },
   blue: {
      badgeBgClass: "bg-gradient-to-r from-cyan-50/30 via-blue-50/30 to-cyan-50/30",
      badgeBorderClass: "border-cyan-200/50",
      badgeTextClass: "text-cyan-50",
      badgeIconClass: "text-cyan-100",
      badgeGlowClass: "shadow-[0_0_15px_rgba(6,182,212,0.4)]",
   },
   purple: {
      badgeBgClass: "bg-gradient-to-r from-purple-50/30 via-indigo-50/30 to-purple-50/30",
      badgeBorderClass: "border-purple-200/50",
      badgeTextClass: "text-purple-50",
      badgeIconClass: "text-purple-100",
      badgeGlowClass: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
   },
};

export default function ModalityBadge({ modality, colorScheme }: ModalityBadgeProps) {
   const colors = colorClasses[colorScheme];
   const isHybrid = modality === "hybrid";

   return (
      <div
         className={`inline-flex flex-col items-start gap-2 ${colors.badgeBgClass} backdrop-blur-md px-5 py-3 border-2 ${colors.badgeBorderClass} rounded-2xl font-semibold ${colors.badgeTextClass} ${colors.badgeGlowClass} transition-all duration-300 hover:scale-105`}
      >
         <div className="flex items-center gap-2.5">
            {isHybrid ? (
               <Building2Icon className={`w-5 h-5 ${colors.badgeIconClass}`} />
            ) : (
               <MonitorIcon className={`w-5 h-5 ${colors.badgeIconClass}`} />
            )}
            <span className="font-bold tracking-wide">{isHybrid ? "Congreso híbrido" : "Congreso 100% en línea"}</span>
         </div>
         {isHybrid && (
            <div className="flex items-center gap-2 opacity-90 ml-7 font-medium text-sm">
               <span>¡Puedes participar presencialmente o en línea desde cualquier lugar!</span>
            </div>
         )}
      </div>
   );
}
