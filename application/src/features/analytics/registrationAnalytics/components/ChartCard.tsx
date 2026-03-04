import type { ReactNode } from "react";

interface ChartCardProps {
   title: string;
   description: string;
   children: ReactNode;
   className?: string;
}

export default function ChartCard({ title, description, children, className = "" }: ChartCardProps) {
   return (
      <div className={`bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden ${className}`}>
         <div className="p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">{title}</h2>
            <p className="mt-1 text-gray-600 text-sm">{description}</p>
         </div>
         <div className="p-6 pt-4 h-[280px]">{children}</div>
      </div>
   );
}
