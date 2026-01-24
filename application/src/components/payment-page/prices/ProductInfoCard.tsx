import { MonitorIcon, PlayCircle, UsersIcon } from "lucide-react";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";

interface ProductInfoCardProps {
   product: CongressProductRecord;
}

function getProductIcon(productType: CongressProductRecord["productType"]) {
   switch (productType) {
      case "congress_online_access":
         return MonitorIcon;
      case "congress_in_person_access":
         return UsersIcon;
      case "congress_recordings":
         return PlayCircle;
      default:
         return MonitorIcon;
   }
}

function getProductTypeLabel(productType: CongressProductRecord["productType"]) {
   switch (productType) {
      case "congress_online_access":
         return "Acceso Online";
      case "congress_in_person_access":
         return "Acceso Presencial";
      case "congress_recordings":
         return "Grabaciones";
      default:
         return "Producto";
   }
}

function getProductTypeColors(productType: CongressProductRecord["productType"]) {
   switch (productType) {
      case "congress_online_access":
         return {
            iconBg: "bg-linear-to-br from-blue-500 to-blue-600",
            badgeBg: "bg-blue-100",
            badgeText: "text-blue-700",
         };
      case "congress_in_person_access":
         return {
            iconBg: "bg-linear-to-br from-green-500 to-green-600",
            badgeBg: "bg-green-100",
            badgeText: "text-green-700",
         };
      case "congress_recordings":
         return {
            iconBg: "bg-linear-to-br from-purple-500 to-purple-600",
            badgeBg: "bg-purple-100",
            badgeText: "text-purple-700",
         };
      default:
         return {
            iconBg: "bg-linear-to-br from-gray-500 to-gray-600",
            badgeBg: "bg-gray-100",
            badgeText: "text-gray-700",
         };
   }
}

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
   const Icon = getProductIcon(product.productType);
   const typeLabel = getProductTypeLabel(product.productType);
   const colors = getProductTypeColors(product.productType);

   return (
      <div className="bg-white shadow-md p-6 sm:p-8 border-2 border-gray-200/50 rounded-xl sm:rounded-2xl backdrop-blur-sm">
         <div className="flex items-start gap-4">
            <div className={`flex justify-center items-center ${colors.iconBg} rounded-full w-14 h-14 sm:w-16 sm:h-16 shrink-0 shadow-lg`}>
               <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="font-bold text-gray-900 text-xl sm:text-2xl">{product.name}</h1>
                  <span className={`${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-md text-xs font-semibold shadow-sm`}>
                     {typeLabel}
                  </span>
               </div>
               {product.description && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{product.description}</p>
               )}
            </div>
         </div>
      </div>
   );
}
