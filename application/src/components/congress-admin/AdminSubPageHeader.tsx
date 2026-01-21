import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface AdminSubPageHeaderProps {
   title: string;
   Icon?: LucideIcon;
   description?: string;
   sideElement?: ReactNode;
}

export default function AdminSubPageHeader({ title, Icon, description, sideElement }: AdminSubPageHeaderProps) {
   return (
      <header className="flex justify-between items-center mb-4">
         <div className="flex items-center gap-3 mb-3">
            {Icon && (
               <div className="flex justify-center items-center bg-sky-50 rounded-lg w-12 h-12">
                  <Icon className="w-6 h-6 text-sky-600" />
               </div>
            )}
            <div>
               <h1 className="font-bold text-gray-900 text-3xl">{title}</h1>
               <p className="mt-1 text-gray-600 text-base">{description}</p>
            </div>
         </div>
         {sideElement && <div className="ml-auto">{sideElement}</div>}
      </header>
   );
}
