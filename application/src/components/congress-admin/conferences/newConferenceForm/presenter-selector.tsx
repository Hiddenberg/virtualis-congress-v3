"use client";

import { Check, ChevronDown, Search, User, X } from "lucide-react";
import { useState } from "react";

interface Presenter {
   id: string;
   name: string;
}

interface PresenterSelectorProps {
   presenters: Presenter[];
   selectedId: string | null;
   onChange: (selectedId: string) => void;
   required?: boolean;
}

export function PresenterSelector({
   presenters,
   selectedId,
   onChange,
   required = false,
}: PresenterSelectorProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   const toggleDropdown = () => {
      setIsOpen(!isOpen);
      // Reset search when opening/closing
      if (!isOpen) {
         setSearchQuery("");
      }
   };

   const handlePresenterSelect = (id: string) => {
      onChange(id);
      setIsOpen(false);
      setSearchQuery("");
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
   };

   const handleSearchClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent dropdown from closing when clicking inside search box
      e.stopPropagation();
   };

   const filteredPresenters = presenters.filter((presenter) =>
      presenter.name.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const selectedPresenter = selectedId
      ? presenters.find((presenter) => presenter.id === selectedId)
      : null;

   return (
      <fieldset className="flex flex-col gap-1">
         <label
            htmlFor="presenter"
            className="flex items-center gap-2 font-medium text-sm"
         >
            <User className="w-4 h-4" />
            Presentador{required && <span className="text-red-500">*</span>}
         </label>
         <div className="relative">
            <div
               className="flex justify-between items-center bg-white px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full cursor-pointer"
               onClick={toggleDropdown}
               role="combobox"
               aria-controls="presenter-dropdown"
               aria-expanded={isOpen}
               aria-haspopup="listbox"
               aria-labelledby="presenter-dropdown"
               tabIndex={0}
            >
               <div className="flex items-center gap-2">
                  {selectedPresenter ? (
                     <span>{selectedPresenter.name}</span>
                  ) : (
                     <span className="text-gray-500">
                        Seleccionar un presentador
                     </span>
                  )}
               </div>
               <div className="flex items-center gap-1">
                  {selectedPresenter && (
                     <button
                        type="button"
                        onClick={(e) => {
                           e.stopPropagation();
                           onChange("");
                        }}
                        className="hover:bg-gray-100 p-1 rounded-full"
                     >
                        <X className="w-3 h-3" />
                     </button>
                  )}
                  <ChevronDown
                     className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
                  />
               </div>
            </div>

            {isOpen && (
               <ul
                  className="z-10 absolute bg-white ring-opacity-5 shadow-lg mt-1 py-1 rounded-md focus:outline-none ring-1 ring-black w-full max-h-60 overflow-auto"
                  role="listbox"
               >
                  <div
                     className="top-0 sticky bg-white px-3 py-2 border-b"
                     onClick={handleSearchClick}
                  >
                     <div className="relative">
                        <Search className="top-1/2 left-2 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                        <input
                           type="text"
                           value={searchQuery}
                           onChange={handleSearchChange}
                           placeholder="Buscar presentador..."
                           className="px-3 py-1 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-sm"
                        />
                     </div>
                  </div>

                  {filteredPresenters.length > 0 ? (
                     filteredPresenters.map((presenter) => (
                        <li
                           key={presenter.id}
                           role="option"
                           aria-selected={selectedId === presenter.id}
                           onClick={() => handlePresenterSelect(presenter.id)}
                           className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 ${
                              selectedId === presenter.id ? "bg-blue-50" : ""
                           }`}
                        >
                           <span>{presenter.name}</span>
                           {selectedId === presenter.id && (
                              <Check className="w-4 h-4 text-blue-500" />
                           )}
                        </li>
                     ))
                  ) : (
                     <li className="px-3 py-2 text-gray-500">
                        No se encontraron presentadores
                     </li>
                  )}

                  {presenters.length === 0 && (
                     <li className="px-3 py-2 text-gray-500">
                        No hay presentadores disponibles
                     </li>
                  )}
               </ul>
            )}
         </div>
         <p className="mt-1 text-gray-500 text-sm">
            El presentador introducirá la conferencia antes de que comience
         </p>
      </fieldset>
   );
}
