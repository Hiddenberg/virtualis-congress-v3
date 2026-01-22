"use client";

import { ChevronDown, ChevronUp, Download, Mail, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AcademicTitle } from "@/data/utils";

export interface Speaker {
   name: string;
   email?: string;
   bio?: string;
   phoneNumber?: string;
   academicTitle?: AcademicTitle;
   specialityDetails?: string;
   presentationPhotoUrl?: string;
}

interface SpeakersTableProps {
   speakers: Speaker[];
   onSpeakerSelect?: (speaker: Speaker) => void;
   searchable?: boolean;
   exportable?: boolean;
}

type SortField = "name" | "email" | "academicTitle" | "specialityDetails";
type SortDirection = "asc" | "desc";

// Avatar component with fallback
function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" | "lg" }) {
   const initials = name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

   const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
   };

   return (
      <div className={`relative shrink-0 rounded-full overflow-hidden bg-gray-100 ${sizeClasses[size]}`}>
         {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
               src={src || "/placeholder.svg"}
               alt={`${name}`}
               className="w-full h-full object-cover"
               onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.setAttribute("data-error", "true");
               }}
            />
         ) : null}
         <div
            className={`absolute inset-0 flex items-center justify-center text-gray-700 font-medium ${src ? "opacity-0" : "opacity-100"}`}
            data-error-visible={!src}
         >
            {initials}
         </div>
      </div>
   );
}

// Badge component for academic titles
function AcademicBadge({ title }: { title?: AcademicTitle }) {
   if (!title || title === "Ninguno") return null;

   return (
      <span className="inline-flex items-center bg-blue-100 px-2 py-0.5 rounded font-medium text-blue-800 text-xs">{title}</span>
   );
}

// Search component
function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
   return (
      <div className="relative">
         <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
         </div>
         <input
            type="text"
            className="block bg-white py-2 pr-3 pl-10 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:text-sm leading-5 placeholder-gray-500"
            placeholder="Search speakers..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
         />
      </div>
   );
}

// Table header cell with sort functionality
function TableHeaderCell({
   label,
   sortable = false,
   sortField,
   currentSortField,
   sortDirection,
   onSort,
}: {
   label: string;
   sortable?: boolean;
   sortField?: SortField;
   currentSortField?: SortField;
   sortDirection?: SortDirection;
   onSort?: (field: SortField) => void;
}) {
   const isSorted = sortable && sortField === currentSortField;

   return (
      <th
         className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? "cursor-pointer hover:bg-gray-50" : ""}`}
         onClick={() => sortable && sortField && onSort?.(sortField)}
      >
         <div className="flex items-center space-x-1">
            <span>{label}</span>
            {sortable && (
               <span className="inline-flex flex-col">
                  <ChevronUp
                     size={12}
                     className={`${isSorted && sortDirection === "asc" ? "text-blue-600" : "text-gray-300"} -mb-1`}
                  />
                  <ChevronDown
                     size={12}
                     className={`${isSorted && sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
                  />
               </span>
            )}
         </div>
      </th>
   );
}

// Empty state component
function EmptyState() {
   return (
      <tr>
         <td colSpan={6} className="px-6 py-12 text-center">
            <div className="flex flex-col justify-center items-center">
               <svg
                  className="mb-4 w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <title>No hay ponentes registrados</title>
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={1.5}
                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
               </svg>
               <h3 className="font-medium text-gray-900 text-lg">No hay ponentes registrados aún</h3>
               <p className="mt-1 text-gray-500 text-sm">
                  Agrega un nuevo ponente para que pueda ser seleccionado en las conferencias
               </p>
            </div>
         </td>
      </tr>
   );
}

// Export function
function exportToCSV(speakers: Speaker[]) {
   const headers = ["Name", "Email", "Phone", "Academic Title", "Specialty", "Bio"];

   const rows = speakers.map((speaker) => [
      speaker.name,
      speaker.email,
      speaker.phoneNumber || "",
      speaker.academicTitle || "",
      speaker.specialityDetails || "",
      speaker.bio || "",
   ]);

   const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
   ].join("\n");

   const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
   });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.setAttribute("href", url);
   link.setAttribute("download", "speakers.csv");
   link.style.visibility = "hidden";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
}

// Main SpeakersTable component
export function SpeakersTable({ speakers, onSpeakerSelect, searchable = false, exportable = false }: SpeakersTableProps) {
   const [searchQuery, setSearchQuery] = useState("");
   const [sortField, setSortField] = useState<SortField>("name");
   const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

   // Handle sorting
   const handleSort = (field: SortField) => {
      if (sortField === field) {
         // Toggle direction if same field
         setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
         // New field, default to ascending
         setSortField(field);
         setSortDirection("asc");
      }
   };

   // Filter and sort speakers
   const filteredAndSortedSpeakers = useMemo(() => {
      // First filter
      let result = speakers;

      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         result = speakers.filter(
            (speaker) =>
               speaker.name.toLowerCase().includes(query) ||
               speaker.email?.toLowerCase().includes(query) ||
               speaker.specialityDetails?.toLowerCase().includes(query) ||
               speaker.phoneNumber?.includes(query) ||
               speaker.bio?.toLowerCase().includes(query),
         );
      }

      // Then sort
      return [...result].sort((a, b) => {
         let valueA = "";
         let valueB = "";

         // Get the values to compare based on sort field
         switch (sortField) {
            case "name":
               valueA = a.name;
               valueB = b.name;
               break;
            case "email":
               valueA = a.email || "";
               valueB = b.email || "";
               break;
            case "academicTitle":
               valueA = a.academicTitle || "";
               valueB = b.academicTitle || "";
               break;
            case "specialityDetails":
               valueA = a.specialityDetails || "";
               valueB = b.specialityDetails || "";
               break;
         }

         // Compare the values
         if (sortDirection === "asc") {
            return valueA.localeCompare(valueB);
         } else {
            return valueB.localeCompare(valueA);
         }
      });
   }, [speakers, searchQuery, sortField, sortDirection]);

   return (
      <div className="bg-white shadow rounded-lg w-full overflow-hidden">
         {/* Table controls */}
         {(searchable || exportable) && (
            <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-4 border-gray-200 border-b">
               {searchable && (
                  <div className="w-full sm:w-64">
                     <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
               )}

               <div className="flex items-center gap-2 ml-auto">
                  {exportable && (
                     <button
                        type="button"
                        onClick={() => exportToCSV(filteredAndSortedSpeakers)}
                        className="inline-flex items-center bg-white hover:bg-gray-50 shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-gray-700 text-sm leading-4"
                     >
                        <Download size={16} className="mr-2" />
                        Export CSV
                     </button>
                  )}
               </div>
            </div>
         )}

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-4 py-3 w-16" />
                     <TableHeaderCell
                        label="Nombre"
                        sortable
                        sortField="name"
                        currentSortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                     />
                     <TableHeaderCell
                        label="Titulo Académico"
                        sortable
                        sortField="academicTitle"
                        currentSortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                     />
                     <TableHeaderCell
                        label="Contacto"
                        sortable
                        sortField="email"
                        currentSortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                     />
                     <TableHeaderCell
                        label="Especialidad"
                        sortable
                        sortField="specialityDetails"
                        currentSortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                     />
                     <th className="relative px-4 py-3">
                        <span className="sr-only">Actions</span>
                     </th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedSpeakers.length > 0 ? (
                     filteredAndSortedSpeakers.map((speaker, index) => (
                        <tr
                           key={speaker.email || index}
                           className="hover:bg-gray-50 transition-colors"
                           onClick={() => onSpeakerSelect?.(speaker)}
                        >
                           <td className="px-4 py-4 whitespace-nowrap">
                              <Avatar src={speaker.presentationPhotoUrl} name={speaker.name} />
                           </td>
                           <td className="px-4 py-4">
                              <div className="font-medium text-gray-900 text-sm">{speaker.name}</div>
                              {speaker.bio && <div className="max-w-xs text-gray-500 text-sm truncate">{speaker.bio}</div>}
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap">
                              {speaker.academicTitle ? (
                                 <AcademicBadge title={speaker.academicTitle} />
                              ) : (
                                 <span className="text-gray-400 text-sm">—</span>
                              )}
                           </td>
                           <td className="px-4 py-4">
                              <div className="flex items-center text-sm">
                                 <Mail
                                    size={14}
                                    className={`shrink-0 mr-1 ${speaker.email ? "text-gray-500" : "text-gray-300"}`}
                                 />
                                 {speaker.email ? (
                                    <span className="max-w-[200px] text-gray-500 truncate">{speaker.email}</span>
                                 ) : (
                                    <span className="text-gray-400 italic">cuenta no vinculada</span>
                                 )}
                              </div>
                              {speaker.phoneNumber && (
                                 <div className="flex items-center mt-1 text-gray-500 text-sm">
                                    <Phone size={14} className="mr-1 shrink-0" />
                                    <span>{speaker.phoneNumber}</span>
                                 </div>
                              )}
                           </td>
                           <td className="px-4 py-4">
                              <div className="max-w-xs text-gray-500 text-sm truncate">
                                 {speaker.specialityDetails || <span className="text-gray-400">—</span>}
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <EmptyState />
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}
