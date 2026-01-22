"use client";

import { CheckCircle, Clock, Copy, Download, Search } from "lucide-react";
import type { RecordModel } from "pocketbase";
import { useMemo, useState } from "react";
import type { CourtesyInvitation } from "@/types/congress";

const CourtesyInvitationsTable = ({ invitations }: { invitations: (CourtesyInvitation & RecordModel)[] }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
   const [copiedCode, setCopiedCode] = useState<string | null>(null);

   const filteredInvitations = useMemo(() => {
      return invitations.filter((invitation) => {
         const matchesFilter =
            filter === "all" || (filter === "used" && invitation.used) || (filter === "unused" && !invitation.used);

         const matchesSearch =
            invitation.stripePromotionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invitation.congress.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const exportToCSV = () => {
      const headers = ["Promo Code", "Status", "Congress", "Sent To", "Redeemed By", "Redeemed At"];

      const csvData = filteredInvitations.map((invitation) => [
         invitation.stripePromotionCode,
         invitation.used ? "Used" : "Pending",
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
            <h2 className="mb-2 font-bold text-2xl">Courtesy Invitations</h2>
            <p className="mb-4 text-gray-600">Manage and track promotional codes for congress registrations</p>
            <div className="flex sm:flex-row flex-col gap-4">
               <div className="relative flex-1">
                  <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" />
                  <input
                     type="text"
                     placeholder="Search by code, email, congress..."
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
                  <option value="all">All</option>
                  <option value="used">Used</option>
                  <option value="unused">Unused</option>
               </select>
               <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
                  onClick={exportToCSV}
               >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
               </button>
            </div>
         </div>
         <div className="px-6 py-4">
            <div className="overflow-x-auto">
               <table className="divide-y divide-gray-200 min-w-full">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Promo Code
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Congress
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Sent To
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Redeemed By
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                           Redeemed At
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
                                    Used
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center bg-yellow-100 px-2.5 py-0.5 rounded-full font-medium text-yellow-800 text-xs">
                                    <Clock className="mr-1 w-4 h-4" />
                                    Pending
                                 </span>
                              )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                 <span className="font-medium">{invitation.stripePromotionCode}</span>
                                 <button
                                    onClick={() => copyPromoCode(invitation.stripePromotionCode)}
                                    className="ml-2 focus:outline-none text-gray-400 hover:text-gray-600"
                                    aria-label={`Copy promo code ${invitation.stripePromotionCode}`}
                                 >
                                    <Copy className="w-4 h-4" />
                                 </button>
                                 {copiedCode === invitation.stripePromotionCode && (
                                    <span className="ml-2 text-green-600 text-sm">Copied!</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">{invitation.congress}</td>
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
