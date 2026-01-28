import { UserPlus } from "lucide-react";

export function FormCardHeader() {
   return (
      <div className="p-6 border-gray-100 border-b">
         <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10">
               <UserPlus className="text-blue-600" size={20} />
            </div>
            <div>
               <h2 className="font-semibold text-gray-900 text-lg">Información del Usuario</h2>
               <p className="text-gray-600 text-sm">Completa los datos del nuevo asistente</p>
            </div>
         </div>
      </div>
   );
}
