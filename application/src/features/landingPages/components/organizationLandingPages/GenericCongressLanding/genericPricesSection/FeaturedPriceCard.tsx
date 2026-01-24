import type { LucideIcon } from "lucide-react";
import { formatPrice } from "./utils";

interface FeaturedPriceCardProps {
   priceAmount: number;
   currency: "mxn" | "usd";
   icon: LucideIcon;
   badge: string;
   title: string;
   description?: string;
   footer?: React.ReactNode;
   gradientFrom: string;
   gradientTo: string;
   borderColor: string;
   badgeGradientFrom: string;
   badgeGradientTo: string;
   titleBgColor: string;
   titleTextColor: string;
   dotColor: string;
   backgroundDecorationIcon?: LucideIcon;
   backgroundDecorationColor?: string;
}

export default function FeaturedPriceCard({
   priceAmount,
   currency,
   icon: Icon,
   badge,
   title,
   description,
   footer,
   gradientFrom,
   gradientTo,
   borderColor,
   badgeGradientFrom,
   badgeGradientTo,
   titleBgColor,
   titleTextColor,
   dotColor,
   backgroundDecorationIcon: BackgroundIcon,
   backgroundDecorationColor,
}: FeaturedPriceCardProps) {
   return (
      <div className="mx-auto max-w-md">
         <div className={`relative bg-linear-to-br ${gradientFrom} ${gradientTo} p-8 border-2 ${borderColor} rounded-2xl`}>
            {/* Background decoration */}
            {BackgroundIcon && (
               <div className="top-4 right-4 absolute opacity-10">
                  <BackgroundIcon className={`w-16 h-16 ${backgroundDecorationColor || dotColor.replace("bg-", "text-")}`} />
               </div>
            )}

            {/* Badge */}
            <div className={`-top-3 left-1/2 absolute bg-linear-to-r ${badgeGradientFrom} ${badgeGradientTo} shadow-lg px-4 py-2 rounded-full font-bold text-white text-xs -translate-x-1/2 transform`}>
               {badge}
            </div>

            <div className="z-10 relative text-center">
               <div className={`w-16 h-16 bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
               </div>
               <div className="mb-3 font-bold text-gray-900 text-3xl">{formatPrice(priceAmount, currency)}</div>
               <div className={`${titleBgColor} mb-4 px-4 py-2 rounded-full font-semibold ${titleTextColor} text-sm`}>
                  {title}
               </div>

               {/* What's included */}
               {description && (
                  <div className="space-y-2 text-gray-700 text-sm text-left">
                     <div className="flex items-center gap-2">
                        <div className={`${dotColor} rounded-full w-2 h-2`} />
                        <span>{description}</span>
                     </div>
                  </div>
               )}

               {footer && <div className="mt-4">{footer}</div>}
            </div>
         </div>
      </div>
   );
}
