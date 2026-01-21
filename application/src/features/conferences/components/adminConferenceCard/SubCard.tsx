import type { ReactNode } from "react";

interface SubCardProps {
   title: string;
   icon: ReactNode;
   badge?: ReactNode;
   children: ReactNode;
   footer?: ReactNode;
}

export default function SubCard({ title, icon, badge, children, footer }: SubCardProps) {
   return (
      <div className="flex flex-col bg-gray-50 p-3 rounded-lg ring-1 ring-gray-200 h-full">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               {icon}
               <span className="font-semibold text-gray-900 text-sm">{title}</span>
            </div>
            {badge}
         </div>
         <div className="flex-1 mt-2 text-gray-700 text-sm">{children}</div>
         {footer && <div className="mt-3">{footer}</div>}
      </div>
   );
}
