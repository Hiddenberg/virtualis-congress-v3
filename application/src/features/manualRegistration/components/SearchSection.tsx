import { Search, Users } from "lucide-react";
import type { UserRecord } from "@/features/users/types/userTypes";
import type { CongressUserRegistrationDetails } from "../services/manualRegistrationServices";
import { RefreshUserRegistrationDetailsButton } from "./RefreshUserRegistrationDetailsButton";
import { UserListItem } from "./UserListItem";

interface SearchSectionProps {
   search: string;
   setSearch: (value: string) => void;
   userRegistrationDetails: CongressUserRegistrationDetails[];
   selectedUser: UserRecord | null;
   setSelectedUser: (user: UserRecord | null) => void;
}

export function SearchSection({ search, setSearch, userRegistrationDetails, selectedUser, setSelectedUser }: SearchSectionProps) {
   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-100 border-b">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3 mb-4">
                  <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10">
                     <Search className="text-blue-600" size={20} />
                  </div>
                  <div>
                     <h2 className="font-semibold text-gray-900 text-lg">Buscar Usuario</h2>
                     <p className="text-gray-600 text-sm">Encuentra al asistente registrado</p>
                  </div>
               </div>

               <RefreshUserRegistrationDetailsButton />
            </div>

            <div className="relative">
               <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" size={16} />
               <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o correo electrónico..."
                  className="py-3 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
               />
            </div>
         </div>

         <div className="p-6">
            <div className="space-y-3 max-h-120 overflow-auto">
               {userRegistrationDetails.length === 0 ? (
                  <div className="py-8 text-gray-500 text-center">
                     <Users className="mx-auto mb-2 text-gray-400" size={24} />
                     <p className="text-sm">{search.trim() ? "No se encontraron usuarios" : "Escribe para buscar usuarios"}</p>
                  </div>
               ) : (
                  userRegistrationDetails.map((item) => (
                     <UserListItem
                        key={item.user.id}
                        user={item.user}
                        hasPaid={item.hasPaid}
                        hasAccessToRecordings={item.hasAccessToRecordings}
                        selected={selectedUser?.id === item.user.id}
                        onSelect={setSelectedUser}
                     />
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
