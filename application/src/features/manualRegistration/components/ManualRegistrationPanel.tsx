"use client";

import { AlertCircle, CheckCircle, CreditCard, Plus, Search, User, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { CongressRecord } from "@/features/congresses/types/congressTypes";
import { registerManualPaymentAction, searchRegisteredUsersAction } from "../serverActions/manualRegistrationActions";

interface UserListItemProps {
   user: UserRecord;
   hasPaid: boolean;
   hasRecordings: boolean;
   selected: boolean;
   onSelect: (user: UserRecord) => void;
}

function UserListItem({ user, hasPaid, hasRecordings, selected, onSelect }: UserListItemProps) {
   const isSelectable = !hasPaid || (hasPaid && !hasRecordings);

   return (
      <button
         type="button"
         onClick={() => isSelectable && onSelect(user)}
         disabled={!isSelectable}
         className={`
            w-full text-left p-4 rounded-lg border transition-all duration-200
            ${selected ? "bg-blue-50 border-blue-200 shadow-sm" : !isSelectable ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60" : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"}
         `}
      >
         <div className="flex items-start gap-3">
            <div className="mt-1 shrink-0">
               <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
               `}
               >
                  <User size={16} />
               </div>
            </div>

            <div className="flex-1 min-w-0">
               <div className="font-semibold text-gray-900 truncate">{user.name}</div>
               <div className="mt-1 text-gray-600 text-sm truncate">{user.email}</div>

               <div className="flex items-center gap-3 mt-2">
                  {hasPaid ? (
                     <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                        <CheckCircle size={12} />
                        Pago confirmado
                     </div>
                  ) : (
                     <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full text-red-700 text-xs">
                        <AlertCircle size={12} />
                        Pago pendiente
                     </div>
                  )}

                  <div
                     className={`
                     flex items-center gap-1 text-xs px-2 py-1 rounded-full
                     ${hasRecordings ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                  `}
                  >
                     <div className={`w-2 h-2 rounded-full ${hasRecordings ? "bg-green-500" : "bg-blue-500"}`} />
                     {hasRecordings ? "Con grabaciones" : "Sin grabaciones"}
                  </div>
               </div>
            </div>
         </div>
      </button>
   );
}

function SearchSection({
   search,
   setSearch,
   users,
   selectedUser,
   setSelectedUser,
}: {
   search: string;
   setSearch: (value: string) => void;
   users: Array<{ user: UserRecord; hasPaid: boolean; hasRecordings: boolean }>;
   selectedUser: UserRecord | null;
   setSelectedUser: (user: UserRecord | null) => void;
}) {
   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-100 border-b">
            <div className="flex items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10">
                  <Search className="text-blue-600" size={20} />
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 text-lg">Buscar Usuario</h2>
                  <p className="text-gray-600 text-sm">Encuentra al asistente registrado</p>
               </div>
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
            <div className="space-y-3 max-h-96 overflow-auto">
               {users.length === 0 ? (
                  <div className="py-8 text-gray-500 text-center">
                     <Users className="mx-auto mb-2 text-gray-400" size={24} />
                     <p className="text-sm">{search.trim() ? "No se encontraron usuarios" : "Escribe para buscar usuarios"}</p>
                  </div>
               ) : (
                  users.map((item) => (
                     <UserListItem
                        key={item.user.id}
                        user={item.user}
                        hasPaid={item.hasPaid}
                        hasRecordings={item.hasRecordings}
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

function PaymentSection({
   selectedUser,
   selectedInfo,
   modality,
   setModality,
   grantRecordingsAccess,
   setGrantRecordingsAccess,
   amount,
   setAmount,
   discount,
   setDiscount,
   currency,
   setCurrency,
   canSubmit,
   isPending,
   onSubmit,
   congress,
}: {
   selectedUser: UserRecord | null;
   selectedInfo: {
      user: UserRecord;
      hasPaid: boolean;
      hasRecordings: boolean;
   } | null;
   modality: "in-person" | "virtual" | "";
   setModality: (value: "in-person" | "virtual" | "") => void;
   grantRecordingsAccess: boolean;
   setGrantRecordingsAccess: (value: boolean) => void;
   amount: string;
   setAmount: (value: string) => void;
   discount: string;
   setDiscount: (value: string) => void;
   currency: string;
   setCurrency: (value: string) => void;
   canSubmit: boolean;
   isPending: boolean;
   onSubmit: () => void;
   congress: CongressRecord;
}) {
   const isPaidSelected = !!selectedInfo?.hasPaid;

   const modalityOptions =
      congress.modality === "online"
         ? [
              {
                 value: "virtual",
                 label: "Virtual",
                 icon: "💻",
              },
           ]
         : [
              {
                 value: "in-person",
                 label: "Presencial",
                 icon: "🏢",
              },
              {
                 value: "virtual",
                 label: "Virtual",
                 icon: "💻",
              },
           ];

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-100 border-b">
            <div className="flex items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-green-100 rounded-lg w-10 h-10">
                  <CreditCard className="text-green-600" size={20} />
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 text-lg">Registro de Pago</h2>
                  <p className="text-gray-600 text-sm">Configura el pago manual del usuario</p>
               </div>
            </div>
         </div>

         <div className="space-y-6 p-6">
            {/* Usuario Seleccionado */}
            <div>
               <label className="block mb-2 font-medium text-gray-700 text-sm">Usuario Seleccionado</label>
               <div className="bg-gray-50 p-4 border rounded-lg">
                  {selectedUser ? (
                     <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-blue-100 rounded-full w-8 h-8">
                           <User className="text-blue-600" size={16} />
                        </div>
                        <div>
                           <div className="font-medium text-gray-900">{selectedUser.name}</div>
                           <div className="text-gray-600 text-sm">{selectedUser.email}</div>
                        </div>
                        {isPaidSelected && (
                           <div className="ml-auto">
                              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                                 <CheckCircle size={12} />
                                 Ya pagado
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

            {/* Modalidad */}
            <div>
               <label className="block mb-3 font-medium text-gray-700 text-sm">Modalidad de Asistencia</label>
               <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
                  {modalityOptions.map((option) => (
                     <button
                        key={option.value}
                        type="button"
                        onClick={() => setModality(option.value as "in-person" | "virtual" | "")}
                        disabled={isPaidSelected}
                        className={`
                           p-4 rounded-lg border-2 transition-all text-left
                           ${modality === option.value ? "border-blue-500 bg-blue-50 text-blue-900" : isPaidSelected ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                        `}
                     >
                        <div className="mb-1 text-lg">{option.icon}</div>
                        <div className="font-medium text-sm">{option.label}</div>
                     </button>
                  ))}
               </div>
               {isPaidSelected && (
                  <p className="flex items-center gap-1 mt-2 text-amber-600 text-xs">
                     <AlertCircle size={12} />
                     No se puede cambiar la modalidad de usuarios ya pagados
                  </p>
               )}
            </div>

            {/* Acceso a Grabaciones */}
            <div>
               <label className="flex items-start gap-3 cursor-pointer">
                  <input
                     type="checkbox"
                     checked={grantRecordingsAccess}
                     onChange={(e) => setGrantRecordingsAccess(e.target.checked)}
                     className="mt-1 border-gray-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
                  />
                  <div>
                     <span className="font-medium text-gray-700 text-sm">Otorgar acceso a grabaciones</span>
                     {isPaidSelected && (
                        <p className="mt-1 text-gray-600 text-xs">
                           Para usuarios ya pagados, solo se puede agregar acceso a grabaciones
                        </p>
                     )}
                  </div>
               </label>
            </div>

            {/* Montos */}
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
               <div className="sm:col-span-2">
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Monto Total</label>
                  <input
                     inputMode="decimal"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                     placeholder="0.00"
                  />
               </div>
               <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Descuento</label>
                  <input
                     inputMode="decimal"
                     value={discount}
                     onChange={(e) => setDiscount(e.target.value)}
                     className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                     placeholder="0.00"
                  />
               </div>
            </div>

            {/* Moneda */}
            <div>
               <label className="block mb-2 font-medium text-gray-700 text-sm">Moneda</label>
               <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
               >
                  <option value="mxn">Pesos Mexicanos (MXN)</option>
                  <option value="usd">Dólares Americanos (USD)</option>
               </select>
            </div>

            {/* Botón de Envío */}
            <div className="pt-4 border-gray-100 border-t">
               <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit || isPending || !modality}
                  loading={isPending}
                  variant="blue"
                  className="w-full"
               >
                  {isPending ? "Procesando pago..." : "Registrar Pago Manual"}
               </Button>
            </div>
         </div>
      </div>
   );
}

export default function ManualRegistrationPanel({ congress }: { congress: CongressRecord }) {
   const [search, setSearch] = useState("");
   const [users, setUsers] = useState<Array<{ user: UserRecord; hasPaid: boolean; hasRecordings: boolean }>>([]);
   const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
   const [modality, setModality] = useState<"in-person" | "virtual" | "">("");
   const [grantRecordingsAccess, setGrantRecordingsAccess] = useState(false);
   const [amount, setAmount] = useState<string>("0");
   const [discount, setDiscount] = useState<string>("0");
   const [currency, setCurrency] = useState<string>("mxn");
   const [isPending, startTransition] = useTransition();

   useEffect(() => {
      const controller = new AbortController();
      const q = search.trim();
      startTransition(async () => {
         const res = await searchRegisteredUsersAction(q);
         if (res.success) {
            setUsers(res.data.users);
         }
      });
      return () => controller.abort();
   }, [search]);

   const selectedInfo = useMemo(() => {
      if (!selectedUser) return null;
      return users.find((item) => item.user.id === selectedUser.id) ?? null;
   }, [users, selectedUser]);
   const isPaidSelected = !!selectedInfo?.hasPaid;

   const canSubmit = useMemo(() => {
      if (!selectedUser) return false;
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) return false;
      if (isPaidSelected && !grantRecordingsAccess) return false;
      return true;
   }, [selectedUser, amount, isPaidSelected, grantRecordingsAccess]);

   const submit = () => {
      if (!modality) {
         toast.error("Debes seleccionar una modalidad de asistencia");
         return;
      }
      if (!selectedUser) return;
      const confirm = window.confirm("¿Estás seguro de querer registrar este pago?");
      if (!confirm) return;
      const parsedAmount = Number(amount);
      const parsedDiscount = Number(discount || 0);
      startTransition(async () => {
         const res = await registerManualPaymentAction({
            userId: selectedUser.id,
            modality: modality || undefined,
            grantRecordingsAccess,
            totalAmount: parsedAmount,
            discount: Number.isFinite(parsedDiscount) ? parsedDiscount : 0,
            currency: currency || undefined,
         });
         if (res.success) {
            toast.success("Pago manual registrado exitosamente");
            setSelectedUser(null);
            setModality("");
            setGrantRecordingsAccess(false);
            setAmount("");
            setDiscount("0");
            window.location.reload();
         } else {
            toast.error(res.errorMessage);
         }
      });
   };

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
               <h1 className="mb-2 font-bold text-gray-900 text-3xl">Registro Manual de Pagos</h1>
               <p className="text-gray-600 text-lg">Gestiona pagos en efectivo y otorga acceso a los asistentes del congreso</p>
            </div>

            {/* Crear Usuario Button */}
            <div className="mb-8">
               <Link
                  href="/manual-registration/new-user"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm px-6 py-3 rounded-lg font-medium text-white transition-colors"
               >
                  <Plus size={16} />
                  Crear Nuevo Usuario
               </Link>
            </div>

            {/* Main Content */}
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
               <SearchSection
                  search={search}
                  setSearch={setSearch}
                  users={users}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
               />

               <PaymentSection
                  selectedUser={selectedUser}
                  selectedInfo={selectedInfo}
                  modality={modality}
                  setModality={setModality}
                  grantRecordingsAccess={grantRecordingsAccess}
                  setGrantRecordingsAccess={setGrantRecordingsAccess}
                  amount={amount}
                  setAmount={setAmount}
                  discount={discount}
                  setDiscount={setDiscount}
                  currency={currency}
                  setCurrency={setCurrency}
                  canSubmit={canSubmit}
                  isPending={isPending}
                  onSubmit={submit}
                  congress={congress}
               />
            </div>
         </div>
      </div>
   );
}
