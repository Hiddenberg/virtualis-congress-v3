import type { RecordModel } from "pocketbase";
import { getAllCoordinatorUsers } from "@/features/users/coordinators/services/coordinatorUserServices";
import { AddCoordinatorForm } from "./AddCoordinatorForm";

export default async function CoordinatorsPage() {
   const coordinators = await getAllCoordinatorUsers();

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-2xl">Coordinators</h1>
            <AddCoordinatorForm />
         </div>

         <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="divide-y divide-gray-200 min-w-full">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Name</th>
                     <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Email</th>
                     <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Created</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {coordinators.map((coordinator: User & RecordModel) => (
                     <tr key={coordinator.id}>
                        <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap">{coordinator.name}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{coordinator.email}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                           {new Date(coordinator.created).toLocaleDateString()}
                        </td>
                     </tr>
                  ))}
                  {coordinators.length === 0 && (
                     <tr>
                        <td colSpan={3} className="px-6 py-4 text-gray-500 text-sm text-center">
                           No coordinators found
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}
