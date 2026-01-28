import { AlertCircle, CheckCircle, Mail, User } from "lucide-react";
import type { UserRecord } from "@/features/users/types/userTypes";

interface UserListItemProps {
   user: UserRecord;
   hasPaid: boolean;
   hasAccessToRecordings: boolean;
   selected: boolean;
   onSelect: (user: UserRecord) => void;
}

export function UserListItem({ user, hasPaid, hasAccessToRecordings, selected, onSelect }: UserListItemProps) {
   const isSelectable = !hasPaid || (hasPaid && !hasAccessToRecordings);

   const hasAdditionalEmails = user.additionalEmail1 || user.additionalEmail2;

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

               {hasAdditionalEmails ? (
                  <div className="space-y-1 mt-2">
                     <div className="flex items-center gap-1 font-medium text-gray-700 text-xs">
                        <Mail size={12} className="text-gray-500" />
                        <span>Correos adicionales:</span>
                     </div>
                     <div className="space-y-0.5 pl-4">
                        {user.additionalEmail1 && (
                           <div className="flex items-center gap-1.5">
                              <div className="bg-blue-500 rounded-full w-1 h-1 shrink-0" />
                              <span className="text-gray-600 text-xs truncate">{user.additionalEmail1}</span>
                           </div>
                        )}
                        {user.additionalEmail2 && (
                           <div className="flex items-center gap-1.5">
                              <div className="bg-blue-500 rounded-full w-1 h-1 shrink-0" />
                              <span className="text-gray-600 text-xs truncate">{user.additionalEmail2}</span>
                           </div>
                        )}
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center gap-1 bg-gray-100 mt-2 px-2 py-1 rounded-full w-fit">
                     <Mail size={10} className="text-gray-500" />
                     <span className="text-gray-600 text-xs">Sin correos adicionales</span>
                  </div>
               )}

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
                     ${hasAccessToRecordings ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                  `}
                  >
                     <div className={`w-2 h-2 rounded-full ${hasAccessToRecordings ? "bg-green-500" : "bg-blue-500"}`} />
                     {hasAccessToRecordings ? "Con grabaciones" : "Sin grabaciones"}
                  </div>
               </div>
            </div>
         </div>
      </button>
   );
}
