import { AlertCircle, CheckCircle, User } from "lucide-react";
import type { UserRecord } from "@/features/users/types/userTypes";

interface UserListItemProps {
   user: UserRecord;
   hasPaid: boolean;
   hasRecordings: boolean;
   selected: boolean;
   onSelect: (user: UserRecord) => void;
}

export function UserListItem({ user, hasPaid, hasRecordings, selected, onSelect }: UserListItemProps) {
   const isSelectable = !hasPaid || (hasPaid && !hasRecordings);

   return (
      <button
         type="button"
         onClick={() => isSelectable && onSelect(user)}
         disabled={!isSelectable}
         className={`
            w-full text-left p-4 rounded-lg border transition-all duration-200
            ${selected ? "bg-blue-50 border-blue-200 shadow-sm" : !isSelectable ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60" : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"}
         `}
      >
         <div className="flex items-start gap-3">
            <div className="mt-1 shrink-0">
               <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
               `}
               >
                  <User size={16} />
               </div>
            </div>

            <div className="flex-1 min-w-0">
               <div className="font-semibold text-gray-900 truncate">{user.name}</div>
               <div className="mt-1 text-gray-600 text-sm truncate">{user.email}</div>

               <div className="flex items-center gap-3 mt-2">
                  {hasPaid ? (
                     <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                        <CheckCircle size={12} />
                        Pago confirmado
                     </div>
                  ) : (
                     <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full text-red-700 text-xs">
                        <AlertCircle size={12} />
                        Pago pendiente
                     </div>
                  )}

                  <div
                     className={`
                     flex items-center gap-1 text-xs px-2 py-1 rounded-full
                     ${hasRecordings ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                  `}
                  >
                     <div className={`w-2 h-2 rounded-full ${hasRecordings ? "bg-green-500" : "bg-blue-500"}`} />
                     {hasRecordings ? "Con grabaciones" : "Sin grabaciones"}
                  </div>
               </div>
            </div>
         </div>
      </button>
   );
}
