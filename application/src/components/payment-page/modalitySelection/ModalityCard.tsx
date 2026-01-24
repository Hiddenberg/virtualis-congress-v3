import { ChevronRightIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface ModalityCardProps {
   title: string;
   description: string;
   icon: LucideIcon;
   features: string[];
   href: string;
   colorScheme: "blue" | "green";
}

export default function ModalityCard({ title, description, icon: Icon, features, href, colorScheme }: ModalityCardProps) {
   const colorClasses = {
      blue: {
         iconBg: "bg-linear-to-br from-blue-500 to-blue-600",
         hoverBorder: "hover:border-blue-400",
         bullet: "bg-blue-500",
         buttonBg: "bg-blue-100 group-hover:bg-blue-200",
         iconColor: "text-blue-600",
      },
      green: {
         iconBg: "bg-linear-to-br from-green-500 to-green-600",
         hoverBorder: "hover:border-green-400",
         bullet: "bg-green-500",
         buttonBg: "bg-green-100 group-hover:bg-green-200",
         iconColor: "text-green-600",
      },
   };

   const colors = colorClasses[colorScheme];

   return (
      <Link
         href={href}
         className={`group relative bg-white hover:shadow-lg p-6 sm:p-8 border-2 border-gray-200 ${colors.hoverBorder} rounded-xl sm:rounded-2xl text-left transition-all duration-300 cursor-pointer`}
      >
         <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4">
               <div
                  className={`flex justify-center items-center ${colors.iconBg} rounded-full w-14 sm:w-16 h-14 sm:h-16 shrink-0`}
               >
                  <Icon className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-bold text-gray-900 text-xl sm:text-2xl">{title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{description}</p>
               </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
               {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                     <div className={`${colors.bullet} mt-0.5 rounded-full w-1.5 h-1.5 shrink-0`} />
                     <span>{feature}</span>
                  </div>
               ))}
            </div>

            <div className="pt-4 border-gray-200 border-t">
               <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">Ver precios</span>
                  <div
                     className={`flex justify-center items-center ${colors.buttonBg} rounded-full w-8 sm:w-10 h-8 sm:h-10 transition-colors`}
                  >
                     <ChevronRightIcon className={`w-4 sm:w-5 h-4 sm:h-5 ${colors.iconColor}`} />
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
}
