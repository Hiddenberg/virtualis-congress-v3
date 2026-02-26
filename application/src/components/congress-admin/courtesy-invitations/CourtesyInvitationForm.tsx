"use client";

import { GiftIcon, InfoIcon, MailIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import {
   createCourtesyInvitationsAction,
   createSingleCourtesyInvitationAndSendEmailAction,
} from "@/features/courtesyInvitations/serverActions/courtesyInvitationActions";

const MAX_QUANTITY = 50;
const MIN_QUANTITY = 1;

type FormMode = "manual" | "batch";

export default function CourtesyInvitationForm() {
   const [mode, setMode] = useState<FormMode>("manual");
   const [email, setEmail] = useState("");
   const [recipientName, setRecipientName] = useState("");
   const [quantity, setQuantity] = useState(1);
   const [error, setError] = useState<string | null>(null);
   const [isCreating, startTransition] = useTransition();
   const router = useRouter();

   const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const validation = z.object({
         email: z.string().email("El correo electrónico no es válido"),
         recipientName: z.string().optional(),
      });

      const result = validation.safeParse({ email: email.trim(), recipientName: recipientName.trim() || undefined });

      if (!result.success) {
         const firstError = result.error.issues[0];
         setError(firstError?.message ?? "Datos inválidos");
         return;
      }

      startTransition(async () => {
         const response = await createSingleCourtesyInvitationAndSendEmailAction({
            email: email.trim(),
            recipientName: recipientName.trim() || undefined,
         });

         if (!response.success) {
            toast.error(response.errorMessage ?? "Error al crear la invitación");
            setError(response.errorMessage ?? null);
            return;
         }

         toast.success("Invitación creada y enviada correctamente");
         router.push("/congress-admin/courtesy-invitations");
      });
   };

   const handleBatchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const validation = z.object({
         quantity: z
            .number()
            .min(MIN_QUANTITY, `La cantidad mínima es ${MIN_QUANTITY}`)
            .max(MAX_QUANTITY, `La cantidad máxima es ${MAX_QUANTITY}`),
      });

      const result = validation.safeParse({ quantity });

      if (!result.success) {
         const firstError = result.error.issues[0];
         setError(firstError?.message ?? "Datos inválidos");
         return;
      }

      startTransition(async () => {
         const response = await createCourtesyInvitationsAction(quantity);

         if (!response.success) {
            toast.error(response.errorMessage ?? "Error al crear las invitaciones");
            setError(response.errorMessage ?? null);
            return;
         }

         toast.success(
            response.data?.createdCount === 1
               ? "Invitación creada correctamente"
               : `${response.data?.createdCount} invitaciones creadas correctamente`,
         );
         router.push("/congress-admin/courtesy-invitations");
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         <div className="bg-blue-50 mb-6 p-4 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
               <div className="bg-blue-100 p-2 rounded-full shrink-0">
                  <InfoIcon className="size-5 text-blue-600" />
               </div>
               <div>
                  <h3 className="mb-1 font-semibold text-blue-900">¿Qué son las invitaciones de cortesía?</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                     Las invitaciones de cortesía generan códigos promocionales únicos que permiten el registro gratuito
                     al congreso. Cada código puede ser canjeado por una sola persona. Puedes crear una invitación
                     individual y enviarla por correo, o generar un lote de códigos para uso posterior.
                  </p>
               </div>
            </div>
         </div>

         {/* Mode selector */}
         <div className="mb-6 flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
               type="button"
               onClick={() => {
                  setMode("manual");
                  setError(null);
               }}
               className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  mode === "manual"
                     ? "bg-white text-gray-900 shadow-sm"
                     : "text-gray-600 hover:text-gray-900"
               }`}
            >
               <MailIcon className="size-4" />
               Invitación individual + email
            </button>
            <button
               type="button"
               onClick={() => {
                  setMode("batch");
                  setError(null);
               }}
               className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  mode === "batch"
                     ? "bg-white text-gray-900 shadow-sm"
                     : "text-gray-600 hover:text-gray-900"
               }`}
            >
               <UsersIcon className="size-4" />
               Generar lote
            </button>
         </div>

         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            {mode === "manual" ? (
               <>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="bg-emerald-100 p-2 rounded-full">
                        <MailIcon className="size-6 text-emerald-600" />
                     </div>
                     <div>
                        <h2 className="font-semibold text-gray-900 text-xl">Enviar invitación por correo</h2>
                        <p className="text-gray-500 text-sm">
                           Crea un código y envíalo automáticamente a la persona invitada
                        </p>
                     </div>
                  </div>

                  <form className="space-y-6" onSubmit={handleManualSubmit}>
                     <fieldset className="space-y-2">
                        <label htmlFor="email" className="block font-medium text-gray-700 text-sm">
                           Correo electrónico del invitado <span className="text-red-500">*</span>
                        </label>
                        <input
                           id="email"
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="invitado@ejemplo.com"
                           className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                           required
                        />
                     </fieldset>

                     <fieldset className="space-y-2">
                        <label htmlFor="recipientName" className="block font-medium text-gray-700 text-sm">
                           Nombre del invitado (opcional)
                        </label>
                        <input
                           id="recipientName"
                           type="text"
                           value={recipientName}
                           onChange={(e) => setRecipientName(e.target.value)}
                           placeholder="Para personalizar el correo"
                           className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                        />
                     </fieldset>

                     {error && (
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                           <p className="text-red-700 text-sm">{error}</p>
                        </div>
                     )}

                     <div className="pt-4 border-gray-100 border-t">
                        <div className="flex justify-end gap-3">
                           <Button
                              variant="secondary"
                              type="button"
                              disabled={isCreating}
                              onClick={() => router.back()}
                           >
                              Cancelar
                           </Button>
                           <Button
                              variant="primary"
                              type="submit"
                              loading={isCreating}
                              disabled={isCreating}
                           >
                              {isCreating ? "Creando y enviando..." : "Crear y enviar invitación"}
                           </Button>
                        </div>
                     </div>
                  </form>
               </>
            ) : (
               <>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="bg-yellow-100 p-2 rounded-full">
                        <GiftIcon className="size-6 text-yellow-600" />
                     </div>
                     <div>
                        <h2 className="font-semibold text-gray-900 text-xl">Generar lote de invitaciones</h2>
                        <p className="text-gray-500 text-sm">
                           Crea múltiples códigos para distribuir manualmente o más adelante
                        </p>
                     </div>
                  </div>

                  <form className="space-y-6" onSubmit={handleBatchSubmit}>
                     <fieldset className="space-y-2">
                        <label htmlFor="quantity" className="block font-medium text-gray-700 text-sm">
                           Cantidad de invitaciones <span className="text-red-500">*</span>
                        </label>
                        <input
                           id="quantity"
                           type="number"
                           min={MIN_QUANTITY}
                           max={MAX_QUANTITY}
                           value={quantity}
                           onChange={(e) => setQuantity(parseInt(e.target.value, 10) || MIN_QUANTITY)}
                           className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full transition-colors"
                           required
                        />
                        <p className="text-gray-500 text-xs">
                           Introduce un número entre {MIN_QUANTITY} y {MAX_QUANTITY}
                        </p>
                     </fieldset>

                     {error && (
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                           <p className="text-red-700 text-sm">{error}</p>
                        </div>
                     )}

                     <div className="pt-4 border-gray-100 border-t">
                        <div className="flex justify-end gap-3">
                           <Button
                              variant="secondary"
                              type="button"
                              disabled={isCreating}
                              onClick={() => router.back()}
                           >
                              Cancelar
                           </Button>
                           <Button
                              variant="primary"
                              type="submit"
                              loading={isCreating}
                              disabled={isCreating}
                           >
                              {isCreating ? "Creando invitaciones..." : "Crear invitaciones"}
                           </Button>
                        </div>
                     </div>
                  </form>
               </>
            )}
         </div>
      </div>
   );
}
