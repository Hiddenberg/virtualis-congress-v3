"use client";

import { CheckCircle, Clock, Copy, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { CourtesyInvitationRecord } from "@/features/courtesyInvitations/types/courtesyInvitationTypes";

const CourtesyInvitationsTable = ({ invitations }: { invitations: CourtesyInvitationRecord[] }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
   const [copiedCode, setCopiedCode] = useState<string | null>(null);

   const filteredInvitations = useMemo(() => {
      return invitations.filter((invitation) => {
         const matchesFilter =
            filter === "all" || (filter === "used" && invitation.used) || (filter === "unused" && !invitation.used);

         const matchesSearch =
            invitation.stripePromotionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invitation.sentTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invitation.userWhoRedeemed?.toLowerCase().includes(searchTerm.toLowerCase());

         return matchesFilter && matchesSearch;
      });
   }, [searchTerm, filter, invitations]);

   const copyPromoCode = (code: string) => {
      navigator.clipboard
         .writeText(code)
         .then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
         })
         .catch((err) => console.error("Failed to copy: ", err));
   };

   const formatDate = (dateString?: string) => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("es-ES", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const exportToCSV = () => {
      const headers = ["Código promocional", "Estado", "Enviado a", "Canjeado por", "Canjeado el"];

      const csvData = filteredInvitations.map((invitation) => [
         invitation.stripePromotionCode,
         invitation.used ? "Usado" : "Pendiente",
         invitation.congress,
         invitation.sentTo || "",
         invitation.userWhoRedeemed || "",
         invitation.redeemedAt ? formatDate(invitation.redeemedAt) : "",
      ]);

      const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], {
         type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "courtesy_invitations.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <div className="bg-white shadow-md rounded-lg w-full">
         <div className="px-6 py-4 border-b">
            <div className="flex sm:flex-row flex-col gap-4">
               <div className="relative flex-1">
                  <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" />
                  <input
                     type="text"
                     placeholder="Buscar por código, email, congreso..."
                     className="py-2 pr-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "used" | "unused")}
               >
                  <option value="all">Todos</option>
                  <option value="used">Usados</option>
                  <option value="unused">No usados</option>
               </select>
               <button
                  type="button"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
                  onClick={exportToCSV}
               >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar CSV</span>
               </button>
            </div>
         </div>
         <div className="px-6 py-4">
            <div className="overflow-x-auto">
               <table className="divide-y divide-gray-200 min-w-full">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Código promocional
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Enviado al correo
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Canjeado por
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Canjeado el
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {filteredInvitations.map((invitation) => (
                        <tr key={invitation.id}>
                           <td className="px-6 py-4 whitespace-nowrap">
                              {invitation.used ? (
                                 <span className="inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs">
                                    <CheckCircle className="mr-1 w-4 h-4" />
                                    Usado
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center bg-yellow-100 px-2.5 py-0.5 rounded-full font-medium text-yellow-800 text-xs">
                                    <Clock className="mr-1 w-4 h-4" />
                                    Disponible
                                 </span>
                              )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                 <span className="font-medium">{invitation.stripePromotionCode}</span>
                                 <button
                                    type="button"
                                    onClick={() => copyPromoCode(invitation.stripePromotionCode)}
                                    className="ml-2 focus:outline-none text-gray-400 hover:text-gray-600"
                                    aria-label={`Copiar código promocional ${invitation.stripePromotionCode}`}
                                 >
                                    <Copy className="w-4 h-4" />
                                 </button>
                                 {copiedCode === invitation.stripePromotionCode && (
                                    <span className="ml-2 text-green-600 text-sm">¡Copiado!</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">{invitation.sentTo || "-"}</td>
                           <td className="px-6 py-4 whitespace-nowrap">{invitation.userWhoRedeemed || "-"}</td>
                           <td className="px-6 py-4 whitespace-nowrap">{formatDate(invitation.redeemedAt)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default CourtesyInvitationsTable;
