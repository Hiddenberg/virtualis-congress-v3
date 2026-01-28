"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { UserRecord } from "@/features/users/types/userTypes";
import { registerManualPaymentAction, searchRegisteredUsersAction } from "../serverActions/manualRegistrationActions";
import { PaymentSection } from "./PaymentSection";
import { SearchSection } from "./SearchSection";

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
