"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import {
   type ChangeEvent,
   type FormEvent,
   useState,
   useTransition,
} from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { registerSpeakerFromAdminFormAction } from "@/features/users/speakers/serverActions/speakerActions";
import type { NewSpeakerData } from "@/features/users/speakers/services/speakerServices";

// Academic titles available in the UI
const academicTitles = [
   "Ninguno",
   "Dr.",
   "LN.",
   "Dra.",
   "Ing.",
   "Arq.",
   "Lic.",
   "Mtro.",
   "Mtra.",
   "M.Sc.",
   "Ph.D.",
   "Téc.",
   "Prof.",
   "Abg.",
   "C.P.",
] as const;

// Zod schema for form validation
const speakerRegistrationSchema = z.object({
   name: z.string().trim().min(1, {
      message: "El nombre es obligatorio",
   }),
   academicTitle: z
      .string()
      .refine(
         (val) =>
            academicTitles.includes(val as (typeof academicTitles)[number]),
         {
            message: "Título académico inválido",
         },
      ),
   specialityDetails: z
      .union([
         z.string().trim().max(500, {
            message: "Máximo 500 caracteres",
         }),
         z.literal(""),
      ])
      .optional(),
   bio: z
      .union([
         z.string().trim().max(1000, {
            message: "Máximo 1000 caracteres",
         }),
         z.literal(""),
      ])
      .optional(),
   phoneNumber: z
      .union([
         z
            .string()
            .trim()
            .regex(/^[0-9+\s\-()]{7,20}$/, {
               message: "Teléfono inválido",
            }),
         z.literal(""),
      ])
      .optional(),
   presentationPhoto: z.instanceof(File).optional(),
});

interface FormFieldProps {
   label: string;
   name: keyof NewSpeakerData;
   type: string;
   value: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   required?: boolean;
   error?: string;
}

export type FormErrors = {
   [K in keyof NewSpeakerData]?: string;
};

// Main form component
function AdminSpeakerRegistrationForm({
   closePopUp,
}: {
   closePopUp: () => void;
}) {
   const [formData, setFormData] = useState<NewSpeakerData>({
      name: "",
      email: "",
      academicTitle: "Dr.",
      specialityDetails: "",
      bio: "",
      presentationPhoto: undefined,
   });
   const [submitting, startTransition] = useTransition();

   const [errors, setErrors] = useState<FormErrors>({});
   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

   function handleChange(
      e: ChangeEvent<
         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
   ): void {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   }

   function handlePhotoChange(e: ChangeEvent<HTMLInputElement>): void {
      const files = e.target.files;
      if (files && files[0]) {
         const file = files[0];
         setFormData({
            ...formData,
            presentationPhoto: file,
         });

         // Create preview URL
         const reader = new FileReader();
         reader.onloadend = (): void => {
            setPhotoPreview(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   }

   function clearPhoto(): void {
      setFormData({
         ...formData,
         presentationPhoto: undefined,
      });
      setPhotoPreview(null);
   }

   function resetForm(): void {
      setFormData({
         name: "",
         email: "",
         academicTitle: "Dr.",
         specialityDetails: "",
         bio: "",
         presentationPhoto: undefined,
      });
      setErrors({});
      setPhotoPreview(null);
   }

   function handleSubmit(e: FormEvent<HTMLFormElement>): void {
      e.preventDefault();

      // Zod validation
      const parsed = speakerRegistrationSchema.safeParse(formData);
      if (!parsed.success) {
         const fieldErrors = parsed.error.flatten().fieldErrors;
         const newErrors: FormErrors = {};
         for (const [key, messages] of Object.entries(fieldErrors)) {
            if (messages && messages[0])
               newErrors[key as keyof NewSpeakerData] = messages[0];
         }
         setErrors(newErrors);
         return;
      }

      // Clear any previous errors
      setErrors({});

      // Submit form data
      startTransition(async () => {
         const speakerDataResult =
            await registerSpeakerFromAdminFormAction(formData);

         if (!speakerDataResult.success) {
            toast.error(speakerDataResult.errorMessage);
            return;
         }

         toast.success("Ponente registrado correctamente");
         closePopUp();
      });
   }

   async function handleSaveAndAddAnother(): Promise<void> {
      // Zod validation
      const parsed = speakerRegistrationSchema.safeParse(formData);
      if (!parsed.success) {
         const fieldErrors = parsed.error.flatten().fieldErrors;
         const newErrors: FormErrors = {};
         for (const [key, messages] of Object.entries(fieldErrors)) {
            if (messages && messages[0])
               newErrors[key as keyof NewSpeakerData] = messages[0];
         }
         setErrors(newErrors);
         return;
      }

      setErrors({});

      startTransition(async () => {
         const speakerDataResult =
            await registerSpeakerFromAdminFormAction(formData);

         if (!speakerDataResult.success) {
            toast.error(speakerDataResult.errorMessage);
            return;
         }

         toast.success("Ponente registrado. Puedes agregar otro.");
         resetForm();
      });
   }

   // Uses the hoisted academicTitles constant

   return (
      <section className="bg-white shadow-sm mx-auto p-6 rounded-lg max-w-xl">
         <h2 className="mb-6 font-semibold text-gray-800 text-2xl">
            Nuevo Conferencista
         </h2>

         <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
               label="Nombre"
               name="name"
               type="text"
               value={formData.name}
               onChange={
                  handleChange as (
                     e: React.ChangeEvent<HTMLInputElement>,
                  ) => void
               }
               required
               error={errors.name}
            />

            <FormField
               label="Email"
               name="email"
               type="email"
               value={formData.email || ""}
               onChange={
                  handleChange as (
                     e: React.ChangeEvent<HTMLInputElement>,
                  ) => void
               }
               error={errors.email}
            />

            <fieldset className="space-y-2">
               <label
                  htmlFor="academicTitle"
                  className="block font-medium text-gray-700 text-sm"
               >
                  Título académico
               </label>
               <select
                  id="academicTitle"
                  name="academicTitle"
                  value={formData.academicTitle}
                  onChange={handleChange}
                  className="shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
               >
                  {academicTitles.map((title) => (
                     <option key={title} value={title}>
                        {title}
                     </option>
                  ))}
               </select>
            </fieldset>

            <FormField
               label="Detalles De Especialidad"
               name="specialityDetails"
               type="text"
               value={formData.specialityDetails || ""}
               onChange={
                  handleChange as (
                     e: React.ChangeEvent<HTMLInputElement>,
                  ) => void
               }
               error={errors.specialityDetails}
            />

            <fieldset className="space-y-2">
               <label
                  htmlFor="bio"
                  className="block font-medium text-gray-700 text-sm"
               >
                  Bio
               </label>
               <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Brief description of your background and expertise"
               />
            </fieldset>

            <FormField
               label="Numero de telefono"
               name="phoneNumber"
               type="tel"
               value={formData.phoneNumber || ""}
               onChange={
                  handleChange as (
                     e: React.ChangeEvent<HTMLInputElement>,
                  ) => void
               }
               error={errors.phoneNumber}
            />

            <fieldset className="space-y-2">
               <label className="block font-medium text-gray-700 text-sm">
                  Foto de presentación
               </label>

               {photoPreview ? (
                  <figure className="relative mb-2 w-32 h-32">
                     <Image
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="rounded-md w-full h-full object-cover"
                        width={320}
                        height={320}
                     />
                     <button
                        type="button"
                        onClick={clearPhoto}
                        className="-top-2 -right-2 absolute bg-red-500 hover:bg-red-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                     >
                        <X size={16} />
                     </button>
                  </figure>
               ) : (
                  <label className="flex flex-col justify-center items-center hover:bg-gray-50 border-2 border-gray-300 border-dashed rounded-md w-full h-32 cursor-pointer">
                     <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <Upload className="mb-1 w-8 h-8 text-gray-400" />
                        <p className="text-gray-500 text-sm">
                           Click to upload a photo
                        </p>
                     </div>
                     <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                     />
                  </label>
               )}
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4">
               <Button onClick={closePopUp} type="button" variant="dark">
                  Cancelar
               </Button>
               <Button
                  onClick={handleSaveAndAddAnother}
                  type="button"
                  variant="blue"
                  loading={submitting}
               >
                  Guardar y agregar otro
               </Button>
               <Button type="submit" variant="primary">
                  {submitting ? "Registrando..." : "Registrar"}
               </Button>
            </div>
         </form>
      </section>
   );
}

// Reusable form field component
function FormField({
   label,
   name,
   type,
   value,
   onChange,
   required = false,
   error,
}: FormFieldProps) {
   return (
      <fieldset className="space-y-2">
         <label
            htmlFor={name}
            className="block font-medium text-gray-700 text-sm"
         >
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <input
            id={name as string}
            name={name as string}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
         />
         {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </fieldset>
   );
}

export default AdminSpeakerRegistrationForm;
