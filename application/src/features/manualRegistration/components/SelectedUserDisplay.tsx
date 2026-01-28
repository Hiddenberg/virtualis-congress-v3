import { AlertCircle, CheckCircle, User } from "lucide-react";
import type { UserRecord } from "@/features/users/types/userTypes";

interface SelectedUserDisplayProps {
   selectedUser: UserRecord | null;
   hasPaid: boolean;
}

export function SelectedUserDisplay({ selectedUser, hasPaid }: SelectedUserDisplayProps) {
   return (
      <div>
         <div className="block mb-2 font-medium text-gray-700 text-sm">Usuario Seleccionado</div>
         <div className="bg-gray-50 p-4 border rounded-lg">
            {selectedUser ? (
               <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-blue-100 rounded-full w-8 h-8">
                     <User className="text-blue-600" size={16} />
                  </div>
                  <div>
                     <div className="font-medium text-gray-900">{selectedUser.name}</div>
                     <div className="text-gray-600 text-sm">{selectedUser.email}</div>
                  </div>
                  {hasPaid && (
                     <div className="ml-auto">
                        <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                           <CheckCircle size={12} />
                           Ya pagado
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="py-4 text-gray-500 text-center">
                  <AlertCircle className="mx-auto mb-2 text-gray-400" size={20} />
                  <p className="text-sm">Selecciona un usuario para continuar</p>
               </div>
            )}
         </div>
      </div>
   );
}
