"use client";

import { Search, User, Users } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { searchOrganizationUsersAction, updateUserProfileAction } from "@/features/users/serverActions/userActions";
import type { RoleType, UserRecord } from "@/features/users/types/userTypes";

interface UserFormState {
   name: string;
   email: string;
   role: RoleType;
   phoneNumber: string;
   dateOfBirth: string;
   additionalEmail1: string;
   additionalEmail2: string;
}

interface FormErrors {
   name?: string;
   email?: string;
   role?: string;
   phoneNumber?: string;
   dateOfBirth?: string;
   additionalEmail1?: string;
   additionalEmail2?: string;
}

const userEditSchema = z.object({
   name: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
   email: z.string().trim().email({ message: "Correo inválido" }),
   role: z.enum(["admin", "attendant", "speaker", "coordinator"]),
   phoneNumber: z
      .union([
         z
            .string()
            .trim()
            .regex(/^[0-9+\s\-()]{7,20}$/, { message: "Teléfono inválido" }),
         z.literal(""),
      ])
      .optional(),
   dateOfBirth: z.union([z.string().trim(), z.literal("")]).optional(),
   additionalEmail1: z.union([z.string().trim().email({ message: "Correo inválido" }), z.literal("")]).optional(),
   additionalEmail2: z.union([z.string().trim().email({ message: "Correo inválido" }), z.literal("")]).optional(),
});

const roleOptions: Array<{ value: RoleType; label: string }> = [
   { value: "attendant", label: "Asistente" },
   { value: "speaker", label: "Ponente" },
   { value: "coordinator", label: "Coordinador" },
   { value: "admin", label: "Administrador" },
];

function getEmptyFormState(): UserFormState {
   return {
      name: "",
      email: "",
      role: "attendant",
      phoneNumber: "",
      dateOfBirth: "",
      additionalEmail1: "",
      additionalEmail2: "",
   };
}

function normalizeValue(value?: string | null): string {
   return value?.trim() ?? "";
}

function toInputDate(dateValue?: string | null): string {
   if (!dateValue) {
      return "";
   }

   const parsed = new Date(dateValue);
   if (Number.isNaN(parsed.getTime())) {
      return "";
   }

   return parsed.toISOString().slice(0, 10);
}

function UserSearchResultItem({
   user,
   selected,
   onSelect,
}: {
   user: UserRecord;
   selected: boolean;
   onSelect: (user: UserRecord) => void;
}) {
   return (
      <button
         type="button"
         onClick={() => onSelect(user)}
         className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
            selected ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
         }`}
      >
         <div className="flex items-start gap-3">
            <div className="mt-1 shrink-0">
               <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
               >
                  <User size={16} />
               </div>
            </div>
            <div className="flex-1 min-w-0">
               <div className="font-semibold text-gray-900 truncate">{user.name}</div>
               <div className="mt-1 text-gray-600 text-sm truncate">{user.email}</div>
               {(user.additionalEmail1 || user.additionalEmail2) && (
                  <div className="space-y-1 mt-2">
                     {user.additionalEmail1 && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                           <span className="bg-blue-500 rounded-full w-1.5 h-1.5" />
                           <span className="truncate">{user.additionalEmail1}</span>
                        </div>
                     )}
                     {user.additionalEmail2 && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                           <span className="bg-blue-500 rounded-full w-1.5 h-1.5" />
                           <span className="truncate">{user.additionalEmail2}</span>
                        </div>
                     )}
                  </div>
               )}
               <div className="mt-2 text-gray-500 text-xs capitalize">
                  {roleOptions.find((option) => option.value === user.role)?.label ?? user.role}
               </div>
            </div>
         </div>
      </button>
   );
}

function UserEditForm({
   selectedUser,
   formData,
   setFormData,
   hasChanges,
   isSaving,
   onSubmit,
   errors,
}: {
   selectedUser: UserRecord | null;
   formData: UserFormState;
   setFormData: (value: UserFormState) => void;
   hasChanges: boolean;
   isSaving: boolean;
   onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
   errors: FormErrors;
}) {
   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl h-full">
         <div className="flex items-center gap-3 mb-6">
            <div className="flex justify-center items-center bg-indigo-100 rounded-lg w-10 h-10">
               <Users className="text-indigo-600" size={20} />
            </div>
            <div>
               <h2 className="font-semibold text-gray-900 text-lg">Editar Usuario</h2>
               <p className="text-gray-600 text-sm">
                  {selectedUser ? "Actualiza la información del usuario seleccionado" : "Selecciona un usuario para editar"}
               </p>
            </div>
         </div>

         {!selectedUser ? (
            <div className="p-6 border border-gray-200 rounded-lg text-gray-500 text-sm text-center">
               Usa la búsqueda para encontrar un usuario y editar sus datos.
            </div>
         ) : (
            <form onSubmit={onSubmit} className="space-y-5">
               <FormField
                  label="Nombre"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  error={errors.name}
                  required
               />

               <FormField
                  label="Correo principal"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  error={errors.email}
                  required
               />

               <FormSelect
                  label="Rol"
                  name="role"
                  value={formData.role}
                  onChange={(value) => setFormData({ ...formData, role: value as RoleType })}
                  options={roleOptions}
                  error={errors.role}
               />

               <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                     label="Teléfono"
                     name="phoneNumber"
                     type="tel"
                     value={formData.phoneNumber}
                     onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                     error={errors.phoneNumber}
                  />
                  <FormField
                     label="Fecha de nacimiento"
                     name="dateOfBirth"
                     type="date"
                     value={formData.dateOfBirth}
                     onChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
                     error={errors.dateOfBirth}
                  />
               </div>

               <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <FormField
                     label="Correo adicional 1"
                     name="additionalEmail1"
                     type="email"
                     value={formData.additionalEmail1}
                     onChange={(value) => setFormData({ ...formData, additionalEmail1: value })}
                     error={errors.additionalEmail1}
                  />
                  <FormField
                     label="Correo adicional 2"
                     name="additionalEmail2"
                     type="email"
                     value={formData.additionalEmail2}
                     onChange={(value) => setFormData({ ...formData, additionalEmail2: value })}
                     error={errors.additionalEmail2}
                  />
               </div>

               <div className="flex justify-end gap-3 pt-2">
                  <Button type="submit" variant="primary" disabled={!hasChanges} loading={isSaving}>
                     {isSaving ? "Guardando..." : "Guardar cambios"}
                  </Button>
               </div>
            </form>
         )}
      </div>
   );
}

function FormField({
   label,
   name,
   type,
   value,
   onChange,
   error,
   required,
}: {
   label: string;
   name: string;
   type: string;
   value: string;
   onChange: (value: string) => void;
   error?: string;
   required?: boolean;
}) {
   return (
      <fieldset className="space-y-2">
         <label htmlFor={name} className="block font-medium text-gray-700 text-sm">
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
         />
         {error && <p className="text-red-500 text-xs">{error}</p>}
      </fieldset>
   );
}

function FormSelect({
   label,
   name,
   value,
   onChange,
   options,
   error,
}: {
   label: string;
   name: string;
   value: string;
   onChange: (value: string) => void;
   options: Array<{ value: string; label: string }>;
   error?: string;
}) {
   return (
      <fieldset className="space-y-2">
         <label htmlFor={name} className="block font-medium text-gray-700 text-sm">
            {label}
         </label>
         <select
            id={name}
            name={name}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
         >
            {options.map((option) => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
         {error && <p className="text-red-500 text-xs">{error}</p>}
      </fieldset>
   );
}

export default function UserManagementPanel() {
   const [search, setSearch] = useState("");
   const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
   const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
   const [formData, setFormData] = useState<UserFormState>(getEmptyFormState());
   const [errors, setErrors] = useState<FormErrors>({});
   const [isSearching, startSearchTransition] = useTransition();
   const [isSaving, startSaveTransition] = useTransition();
   const activeSearchRef = useRef("");

   useEffect(() => {
      if (!selectedUser) {
         setFormData(getEmptyFormState());
         setErrors({});
         return;
      }

      setFormData({
         name: selectedUser.name ?? "",
         email: selectedUser.email ?? "",
         role: selectedUser.role === "super_admin" ? "admin" : selectedUser.role,
         phoneNumber: selectedUser.phoneNumber ?? "",
         dateOfBirth: toInputDate(selectedUser.dateOfBirth),
         additionalEmail1: selectedUser.additionalEmail1 ?? "",
         additionalEmail2: selectedUser.additionalEmail2 ?? "",
      });
      setErrors({});
   }, [selectedUser]);

   useEffect(() => {
      const normalizedQuery = search.trim();
      if (normalizedQuery.length < 2) {
         setSearchResults([]);
         return;
      }

      activeSearchRef.current = normalizedQuery;
      const timeoutId = setTimeout(() => {
         startSearchTransition(async () => {
            const response = await searchOrganizationUsersAction(normalizedQuery);
            if (activeSearchRef.current !== normalizedQuery) {
               return;
            }
            if (!response.success) {
               toast.error(response.errorMessage);
               setSearchResults([]);
               return;
            }
            setSearchResults(response.data.users.filter((user) => user.role !== "super_admin"));
         });
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [search]);

   const hasChanges = useMemo(() => {
      if (!selectedUser) {
         return false;
      }

      return (
         normalizeValue(formData.name) !== normalizeValue(selectedUser.name) ||
         normalizeValue(formData.email) !== normalizeValue(selectedUser.email) ||
         formData.role !== selectedUser.role ||
         normalizeValue(formData.phoneNumber) !== normalizeValue(selectedUser.phoneNumber) ||
         normalizeValue(formData.dateOfBirth) !== normalizeValue(selectedUser.dateOfBirth) ||
         normalizeValue(formData.additionalEmail1) !== normalizeValue(selectedUser.additionalEmail1) ||
         normalizeValue(formData.additionalEmail2) !== normalizeValue(selectedUser.additionalEmail2)
      );
   }, [formData, selectedUser]);

   function handleSelectUser(user: UserRecord) {
      setSelectedUser(user);
   }

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (!selectedUser) {
         return;
      }

      const parsed = userEditSchema.safeParse(formData);
      if (!parsed.success) {
         const fieldErrors = parsed.error.flatten().fieldErrors;
         const nextErrors: FormErrors = {};
         for (const [key, messages] of Object.entries(fieldErrors)) {
            if (messages?.[0]) {
               nextErrors[key as keyof FormErrors] = messages[0];
            }
         }
         setErrors(nextErrors);
         return;
      }

      setErrors({});

      startSaveTransition(async () => {
         const response = await updateUserProfileAction({
            userId: selectedUser.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            additionalEmail1: formData.additionalEmail1,
            additionalEmail2: formData.additionalEmail2,
         });

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         toast.success("Usuario actualizado correctamente");
         setSelectedUser(response.data.userUpdated as UserRecord);
         setSearchResults((prev) =>
            prev.map((item) => (item.id === response.data.userUpdated.id ? (response.data.userUpdated as UserRecord) : item)),
         );
      });
   }

   return (
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
         <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
            <div className="p-6 border-gray-100 border-b">
               <div className="flex items-center gap-3 mb-4">
                  <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10">
                     <Search className="text-blue-600" size={20} />
                  </div>
                  <div>
                     <h2 className="font-semibold text-gray-900 text-lg">Buscar Usuarios</h2>
                     <p className="text-gray-600 text-sm">Busca por nombre o correo electrónico</p>
                  </div>
               </div>

               <div className="relative">
                  <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" size={16} />
                  <input
                     value={search}
                     onChange={(event) => setSearch(event.target.value)}
                     placeholder="Escribe al menos 2 caracteres..."
                     className="py-3 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                  />
               </div>
            </div>

            <div className="p-6">
               <div className="space-y-3 max-h-140 overflow-auto">
                  {searchResults.length === 0 ? (
                     <div className="py-8 text-gray-500 text-center">
                        <Users className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm">
                           {search.trim().length < 2
                              ? "Escribe para buscar usuarios"
                              : isSearching
                                ? "Buscando usuarios..."
                                : "No se encontraron usuarios"}
                        </p>
                     </div>
                  ) : (
                     searchResults.map((user) => (
                        <UserSearchResultItem
                           key={user.id}
                           user={user}
                           selected={selectedUser?.id === user.id}
                           onSelect={handleSelectUser}
                        />
                     ))
                  )}
               </div>
            </div>
         </div>

         <div className="lg:col-span-2">
            <UserEditForm
               selectedUser={selectedUser}
               formData={formData}
               setFormData={setFormData}
               hasChanges={hasChanges}
               isSaving={isSaving}
               onSubmit={handleSubmit}
               errors={errors}
            />
         </div>
      </div>
   );
}
