"use client";

import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { searchOrganizationUsersAction } from "@/features/users/serverActions/userActions";
import type { UserRecord } from "@/features/users/types/userTypes";

export interface UserOption {
   value: string;
   label: string;
   email: string;
   user: UserRecord;
}

interface UserLinkSelectProps {
   value: UserOption | null;
   onChange: (option: UserOption | null) => void;
   placeholder?: string;
   isDisabled?: boolean;
   excludeUserIds?: string[];
   inputId?: string;
}

export default function UserLinkSelect({
   value,
   onChange,
   placeholder = "Buscar usuario por nombre o correo...",
   isDisabled = false,
   excludeUserIds = [],
   inputId = "user-link-select-input",
}: UserLinkSelectProps) {
   const loadOptions = useCallback(
      async (inputValue: string): Promise<UserOption[]> => {
         const trimmed = inputValue.trim();
         if (trimmed.length < 2) {
            return [];
         }

         const response = await searchOrganizationUsersAction(trimmed);
         if (!response.success || !response.data?.users) {
            return [];
         }

         const excludedSet = new Set(excludeUserIds);
         return response.data.users
            .filter((user) => !excludedSet.has(user.id) && user.role !== "super_admin")
            .map((user) => ({
               value: user.id,
               label: `${user.name} (${user.email})`,
               email: user.email ?? "",
               user,
            }));
      },
      [excludeUserIds],
   );

   return (
      <AsyncSelect<UserOption, false>
         inputId={inputId}
         value={value}
         onChange={(opt) => onChange(opt)}
         loadOptions={loadOptions}
         defaultOptions={[]}
         cacheOptions
         isClearable
         isDisabled={isDisabled}
         placeholder={placeholder}
         noOptionsMessage={({ inputValue }) =>
            inputValue.length < 2 ? "Escribe al menos 2 caracteres para buscar" : "No se encontraron usuarios"
         }
         loadingMessage={() => "Buscando..."}
         classNamePrefix="user-link-select"
         styles={{
            control: (base, state) => ({
               ...base,
               minHeight: 38,
               borderRadius: 8,
               borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
               boxShadow: state.isFocused ? "0 0 0 2px rgba(37,99,235,0.2)" : "none",
               ":hover": {
                  borderColor: state.isFocused ? "#2563eb" : "#9ca3af",
               },
               backgroundColor: "#ffffff",
            }),
            valueContainer: (base) => ({
               ...base,
               padding: "2px 8px",
            }),
            singleValue: (base) => ({
               ...base,
               color: "#111827",
            }),
            placeholder: (base) => ({
               ...base,
               color: "#6b7280",
            }),
            menu: (base) => ({
               ...base,
               borderRadius: 8,
               overflow: "hidden",
            }),
            option: (base, state) => ({
               ...base,
               padding: 10,
               fontSize: 14,
               backgroundColor: state.isFocused ? "#eff6ff" : state.isSelected ? "#dbeafe" : "#ffffff",
               color: state.isFocused ? "#1d4ed8" : "#111827",
               cursor: "pointer",
            }),
         }}
      />
   );
}
