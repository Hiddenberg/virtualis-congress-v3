import type { LucideIcon } from "lucide-react";

interface StatCardProps {
   title: string;
   value: number;
   icon: LucideIcon;
   color: string;
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
         <div className="flex justify-between items-center">
            <div>
               <p className="font-medium text-gray-600 text-sm">{title}</p>
               <p className="mt-2 font-bold text-gray-900 text-3xl">{value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
               <Icon className="w-6 h-6" />
            </div>
         </div>
      </div>
   );
}
