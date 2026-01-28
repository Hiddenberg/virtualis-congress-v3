import { AlertCircle, CheckCircle, Mail, User } from "lucide-react";
import type { UserRecord } from "@/features/users/types/userTypes";

interface SelectedUserDisplayProps {
   selectedUser: UserRecord | null;
   hasPaid: boolean;
}

export function SelectedUserDisplay({ selectedUser, hasPaid }: SelectedUserDisplayProps) {
   const hasAdditionalEmails = selectedUser?.additionalEmail1 || selectedUser?.additionalEmail2;

   return (
      <div>
         <div className="block mb-2 font-medium text-gray-700 text-sm">Usuario Seleccionado</div>
         <div className="bg-gray-50 p-4 border rounded-lg">
            {selectedUser ? (
               <div className="space-y-3">
                  <div className="flex items-start gap-3">
                     <div className="flex justify-center items-center bg-blue-100 rounded-full w-8 h-8 shrink-0">
                        <User className="text-blue-600" size={16} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{selectedUser.name}</div>
                        <div className="text-gray-600 text-sm">{selectedUser.email}</div>
                     </div>
                     {hasPaid && (
                        <div className="shrink-0">
                           <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                              <CheckCircle size={12} />
                              Ya pagado
                           </div>
                        </div>
                     )}
                  </div>

                  {hasAdditionalEmails ? (
                     <div className="space-y-1 pl-11">
                        <div className="flex items-center gap-1 font-medium text-gray-700 text-xs">
                           <Mail size={12} className="text-gray-500" />
                           <span>Correos adicionales:</span>
                        </div>
                        <div className="space-y-0.5 pl-4">
                           {selectedUser.additionalEmail1 && (
                              <div className="flex items-center gap-1.5">
                                 <div className="bg-blue-500 rounded-full w-1 h-1 shrink-0" />
                                 <span className="text-gray-600 text-xs truncate">{selectedUser.additionalEmail1}</span>
                              </div>
                           )}
                           {selectedUser.additionalEmail2 && (
                              <div className="flex items-center gap-1.5">
                                 <div className="bg-blue-500 rounded-full w-1 h-1 shrink-0" />
                                 <span className="text-gray-600 text-xs truncate">{selectedUser.additionalEmail2}</span>
                              </div>
                           )}
                        </div>
                     </div>
                  ) : (
                     <div className="pl-11">
                        <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full w-fit">
                           <Mail size={10} className="text-gray-500" />
                           <span className="text-gray-600 text-xs">Sin correos adicionales</span>
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
