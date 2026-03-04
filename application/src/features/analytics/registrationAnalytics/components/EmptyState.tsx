import { Users } from "lucide-react";

export default function EmptyState() {
   return (
      <div className="flex flex-col justify-center items-center py-16 bg-white shadow-sm border border-gray-200 rounded-xl">
         <Users className="mb-4 w-16 h-16 text-gray-300" />
         <h3 className="mb-2 font-semibold text-gray-900 text-lg">Sin registros aún</h3>
         <p className="text-gray-500 text-sm">
            Los gráficos se mostrarán cuando haya registros en el congreso
         </p>
      </div>
   );
}
