import UserManagementPanel from "@/components/congress-admin/users/UserManagementPanel";

export default function UsersAdminPage() {
   return (
      <div className="bg-gray-50 p-6 min-h-screen">
         <div className="space-y-6 mx-auto max-w-6xl">
            <div className="pb-4 border-gray-200 border-b">
               <h1 className="font-bold text-gray-900 text-3xl">Gestión de Usuarios</h1>
               <p className="mt-2 text-gray-600">Busca usuarios registrados y actualiza su información</p>
            </div>

            <UserManagementPanel />
         </div>
      </div>
   );
}
