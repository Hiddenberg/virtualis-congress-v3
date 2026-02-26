"use client";

import { GiftIcon, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { createCourtesyInvitationsAction } from "@/features/courtesyInvitations/serverActions/courtesyInvitationActions";

const MAX_QUANTITY = 50;
const MIN_QUANTITY = 1;

export default function CourtesyInvitationForm() {
   const [quantity, setQuantity] = useState(1);
   const [error, setError] = useState<string | null>(null);
   const [isCreating, startTransition] = useTransition();
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                     al congreso. Cada código puede ser canjeado por una sola persona. Puedes generar hasta 50 códigos
                     por solicitud.
                  </p>
               </div>
            </div>
         </div>

         <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-yellow-100 p-2 rounded-full">
                  <GiftIcon className="size-6 text-yellow-600" />
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 text-xl">Generar invitaciones</h2>
                  <p className="text-gray-500 text-sm">Indica cuántos códigos promocionales deseas crear</p>
               </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
         </div>
      </div>
   );
}
