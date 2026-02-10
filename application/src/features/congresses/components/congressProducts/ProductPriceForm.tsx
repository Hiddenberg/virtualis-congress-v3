"use client";

import { AlertCircle, DollarSignIcon, InfoIcon, PlayIcon, ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { createCongressProductPriceAction } from "../../serverActions/congressProductPricesActions";
import type { NewProductPriceData } from "../../types/congressProductPricesTypes";
import type { CongressProductRecord } from "../../types/congressProductsTypes";

const productPriceSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, {
         message: "El nombre del precio es obligatorio",
      })
      .max(100, {
         message: "El nombre no puede exceder 100 caracteres",
      }),
   priceAmount: z.number().max(1000000, {
      message: "El monto no puede exceder 1,000,000",
   }),
   currency: z.enum(["mxn", "usd"]),
   requiresCredentialValidation: z.boolean().default(false),
   credentialValidationInstructions: z
      .string()
      .trim()
      .max(500, {
         message: "Las instrucciones no pueden exceder 500 caracteres",
      })
      .optional(),
   includesRecordings: z.boolean().default(false),
});

type FormErrors = Partial<Record<keyof NewProductPriceData, string>>;

interface FormFieldProps {
   label: string;
   name: keyof NewProductPriceData;
   required?: boolean;
   error?: string;
   children: React.ReactNode;
   description?: string;
}

function FormField({ label, name, required = false, error, children, description }: FormFieldProps) {
   return (
      <div>
         <label htmlFor={name as string} className="block mb-2 font-medium text-gray-700 text-sm">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
         </label>
         {description && <p className="mb-2 text-gray-500 text-xs">{description}</p>}
         {children}
         {error && (
            <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
               <AlertCircle className="w-3 h-3" />
               {error}
            </p>
         )}
      </div>
   );
}

export default function ProductPriceForm({ productId }: { productId: CongressProductRecord["id"] }) {
   const [isPending, startTransition] = useTransition();
   const [priceFormData, setPriceFormData] = useState<NewProductPriceData & { credentialValidationInstructions?: string }>({
      name: "",
      currency: "mxn",
      priceAmount: 0,
      requiresCredentialValidation: false,
      credentialValidationInstructions: "",
      includesRecordings: false,
      product: productId,
   });
   const router = useRouter();
   const [errors, setErrors] = useState<FormErrors>({});

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      if (type === "checkbox") {
         setPriceFormData({ ...priceFormData, [name]: checked });
         // Clear credential validation instructions error if unchecking
         if (name === "requiresCredentialValidation" && !checked) {
            setErrors({ ...errors, credentialValidationInstructions: undefined });
         }
      } else if (name === "priceAmount") {
         const numValue = parseFloat(value);
         setPriceFormData({ ...priceFormData, [name]: Number.isNaN(numValue) ? 0 : numValue });
      } else {
         setPriceFormData({ ...priceFormData, [name]: value });
      }

      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
         setErrors({ ...errors, [name]: undefined });
      }
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      // Custom validation: if requiresCredentialValidation is true, instructions must be provided
      if (priceFormData.requiresCredentialValidation && !priceFormData.credentialValidationInstructions?.trim()) {
         setErrors({
            credentialValidationInstructions: "Las instrucciones de validación son requeridas cuando se requiere validación",
         });
         return;
      }

      // Prepare data for validation (remove empty optional field if not needed)
      const validationData = {
         ...priceFormData,
         credentialValidationInstructions: priceFormData.requiresCredentialValidation
            ? priceFormData.credentialValidationInstructions
            : undefined,
      };

      const result = productPriceSchema.safeParse(validationData);

      if (!result.success) {
         const fieldErrors: FormErrors = {};
         result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof NewProductPriceData;
            if (field) {
               fieldErrors[field] = issue.message;
            }
         });
         setErrors(fieldErrors);
         return;
      }

      startTransition(async () => {
         const submitData: NewProductPriceData = {
            name: result.data.name,
            currency: result.data.currency,
            priceAmount: result.data.priceAmount,
            requiresCredentialValidation: result.data.requiresCredentialValidation,
            credentialValidationInstructions: result.data.credentialValidationInstructions,
            includesRecordings: result.data.includesRecordings,
            product: productId,
         };

         const response = await createCongressProductPriceAction(submitData);
         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }
         toast.success("Precio del producto creado correctamente");
         router.push(`/congress-admin/products/${productId}/prices`);
      });
   };

   return (
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
         <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Nombre del precio" name="name" required error={errors.name}>
               <input
                  id="name"
                  name="name"
                  type="text"
                  value={priceFormData.name}
                  onChange={handleChange}
                  placeholder="Ej: Precio Regular, Precio Early Bird, Precio Estudiante"
                  className={`w-full px-3 py-2 border ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
               />
            </FormField>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
               <FormField label="Monto" name="priceAmount" required error={errors.priceAmount}>
                  <div className="relative">
                     <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <DollarSignIcon className="w-5 h-5 text-gray-400" />
                     </div>
                     <input
                        id="priceAmount"
                        name="priceAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={priceFormData.priceAmount || ""}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`w-full pl-10 pr-3 py-2 border ${errors.priceAmount ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                     />
                  </div>
               </FormField>

               <FormField label="Moneda" name="currency" required error={errors.currency}>
                  <select
                     id="currency"
                     name="currency"
                     value={priceFormData.currency}
                     onChange={handleChange}
                     className={`w-full px-3 py-2 border ${errors.currency ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  >
                     <option value="mxn">MXN - Peso Mexicano</option>
                     <option value="usd">USD - Dólar Estadounidense</option>
                  </select>
               </FormField>
            </div>

            <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg space-y-4">
               <FormField
                  label="Incluye grabaciones"
                  name="includesRecordings"
                  description="Si está habilitado, este precio incluirá automáticamente el acceso a las grabaciones del congreso"
               >
                  <div className="flex items-center gap-3">
                     <input
                        id="includesRecordings"
                        name="includesRecordings"
                        type="checkbox"
                        checked={priceFormData.includesRecordings}
                        onChange={handleChange}
                        className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500 w-4 h-4 text-blue-600"
                     />
                     <label htmlFor="includesRecordings" className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                        <PlayIcon className="w-4 h-4 text-gray-500" />
                        Incluye acceso a grabaciones
                     </label>
                  </div>
               </FormField>

               <FormField
                  label="Validación de credenciales"
                  name="requiresCredentialValidation"
                  description="Si está habilitado, los usuarios deberán subir una imagen de sus credenciales para comprar con este precio"
               >
                  <div className="flex items-center gap-3">
                     <input
                        id="requiresCredentialValidation"
                        name="requiresCredentialValidation"
                        type="checkbox"
                        checked={priceFormData.requiresCredentialValidation}
                        onChange={handleChange}
                        className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500 w-4 h-4 text-blue-600"
                     />
                     <label
                        htmlFor="requiresCredentialValidation"
                        className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"
                     >
                        <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                        Requiere validación de credenciales
                     </label>
                  </div>
               </FormField>

               {priceFormData.requiresCredentialValidation && (
                  <div className="mt-4">
                     <FormField
                        label="Instrucciones de validación"
                        name="credentialValidationInstructions"
                        required
                        error={errors.credentialValidationInstructions}
                        description="Describe qué credenciales o información deben proporcionar los usuarios para comprar este precio"
                     >
                        <div className="relative">
                           <div className="top-3 left-3 absolute pointer-events-none">
                              <InfoIcon className="w-5 h-5 text-gray-400" />
                           </div>
                           <textarea
                              id="credentialValidationInstructions"
                              name="credentialValidationInstructions"
                              rows={4}
                              value={priceFormData.credentialValidationInstructions || ""}
                              onChange={handleChange}
                              placeholder="Ej: Debe proporcionar número de colegiatura válido, credencial de estudiante activa, etc."
                              className={`w-full pl-10 pr-3 py-2 border ${errors.credentialValidationInstructions ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none`}
                           />
                        </div>
                     </FormField>
                  </div>
               )}
            </div>

            <div className="flex justify-end items-center gap-3 pt-4 border-gray-200 border-t">
               <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="justify-center"
               >
                  Cancelar
               </Button>
               <Button type="submit" variant="blue" loading={isPending} className="justify-center">
                  Crear precio
               </Button>
            </div>
         </form>
      </div>
   );
}
