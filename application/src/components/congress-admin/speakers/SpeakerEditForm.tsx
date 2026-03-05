"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { type ChangeEvent, type FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { academicTitles } from "@/data/utils";
import {
   type UpdateSpeakerFormData,
   unlinkSpeakerAccountAction,
   updateSpeakerAction,
} from "@/features/users/speakers/serverActions/speakerActions";
import type { SpeakerWithUser } from "@/features/users/speakers/services/speakerServices";
import UserLinkSelect, { type UserOption } from "./UserLinkSelect";

const speakerEditSchema = z.object({
   displayName: z.string().trim().min(1, {
      message: "El nombre es obligatorio",
   }),
   academicTitle: z.string().refine((val) => academicTitles.includes(val as (typeof academicTitles)[number]), {
      message: "Título académico inválido",
   }),
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
   presentationPhoto: z.instanceof(File).optional(),
});

type FormErrors = Partial<Record<keyof UpdateSpeakerFormData, string>>;

interface SpeakerEditFormProps {
   speaker: SpeakerWithUser;
}

function FormField({
   label,
   name,
   type,
   value,
   onChange,
   required = false,
   error,
   disabled,
}: {
   label: string;
   name: string;
   type: string;
   value: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   required?: boolean;
   error?: string;
   disabled?: boolean;
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
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
         />
         {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </fieldset>
   );
}

export default function SpeakerEditForm({ speaker }: SpeakerEditFormProps) {
   const router = useRouter();
   const linkedEmail = speaker.expand?.user?.email;

   const [formData, setFormData] = useState({
      displayName: speaker.displayName,
      academicTitle: speaker.academicTitle ?? "Ninguno",
      specialityDetails: speaker.specialityDetails ?? "",
      bio: speaker.bio ?? "",
   });
   const [selectedUserToLink, setSelectedUserToLink] = useState<UserOption | null>(null);
   const [errors, setErrors] = useState<FormErrors>({});
   const [submitting, startTransition] = useTransition();

   function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   }

   function handleSubmit(e: FormEvent<HTMLFormElement>): void {
      e.preventDefault();

      const parsed = speakerEditSchema.safeParse(formData);
      if (!parsed.success) {
         const fieldErrors = parsed.error.flatten().fieldErrors;
         const newErrors: FormErrors = {};
         for (const [key, messages] of Object.entries(fieldErrors)) {
            if (messages?.[0]) newErrors[key as keyof FormErrors] = messages[0];
         }
         setErrors(newErrors);
         return;
      }

      setErrors({});

      startTransition(async () => {
         const payload: UpdateSpeakerFormData = {
            speakerId: speaker.id,
            displayName: formData.displayName.trim(),
            academicTitle: formData.academicTitle as (typeof academicTitles)[number],
            specialityDetails: formData.specialityDetails || undefined,
            bio: formData.bio || undefined,
         };

         if (selectedUserToLink?.email?.trim()) {
            payload.linkEmail = selectedUserToLink.email.trim();
         }

         const result = await updateSpeakerAction(payload);

         if (!result.success) {
            toast.error(result.errorMessage);
            return;
         }

         toast.success("Ponente actualizado correctamente");
         setSelectedUserToLink(null);
         router.refresh();
      });
   }

   function handleUnlink(): void {
      if (
         !confirm(
            "¿Desvincular la cuenta de este ponente? El usuario podrá seguir accediendo con su correo pero ya no estará asociado a este perfil.",
         )
      ) {
         return;
      }

      startTransition(async () => {
         const result = await unlinkSpeakerAccountAction(speaker.id);
         if (!result.success) {
            toast.error(result.errorMessage);
            return;
         }
         toast.success("Cuenta desvinculada correctamente");
         router.refresh();
      });
   }

   return (
      <section className="bg-white shadow-sm mx-auto p-6 rounded-lg max-w-xl">
         <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-800 text-2xl">Editar conferencista</h2>
            <Link href="/congress-admin/speakers" className="font-medium text-blue-600 hover:text-blue-700 text-sm">
               ← Volver a lista
            </Link>
         </div>

         <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
               label="Nombre"
               name="displayName"
               type="text"
               value={formData.displayName}
               onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
               required
               error={errors.displayName}
            />

            <fieldset className="space-y-2">
               <label htmlFor="academicTitle" className="block font-medium text-gray-700 text-sm">
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
               label="Detalles de especialidad"
               name="specialityDetails"
               type="text"
               value={formData.specialityDetails}
               onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
               error={errors.specialityDetails}
            />

            <fieldset className="space-y-2">
               <label htmlFor="bio" className="block font-medium text-gray-700 text-sm">
                  Bio
               </label>
               <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Breve descripción de tu formación y experiencia"
               />
            </fieldset>

            <div className="space-y-4 pt-5 border-gray-200 border-t">
               <h3 className="font-medium text-gray-800">Cuenta vinculada</h3>
               {linkedEmail ? (
                  <div className="flex flex-wrap justify-between items-center gap-3">
                     <div>
                        <p className="text-gray-600 text-sm">Correo vinculado:</p>
                        <p className="font-medium text-gray-900">{linkedEmail}</p>
                     </div>
                     <Button type="button" variant="destructive" onClick={handleUnlink} loading={submitting}>
                        Desvincular cuenta
                     </Button>
                  </div>
               ) : (
                  <fieldset className="space-y-2">
                     <label htmlFor="user-link-select-input" className="block font-medium text-gray-700 text-sm">
                        Vincular cuenta existente
                     </label>
                     <UserLinkSelect
                        inputId="user-link-select-input"
                        value={selectedUserToLink}
                        onChange={setSelectedUserToLink}
                        placeholder="Buscar usuario por nombre o correo..."
                     />
                     <p className="text-gray-500 text-xs">
                        Escribe al menos 2 caracteres para buscar usuarios de la organización
                     </p>
                  </fieldset>
               )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
               <Link href="/congress-admin/speakers">
                  <Button type="button" variant="dark">
                     Cancelar
                  </Button>
               </Link>
               <Button type="submit" variant="primary" loading={submitting}>
                  {submitting ? "Guardando..." : "Guardar cambios"}
               </Button>
            </div>
         </form>
      </section>
   );
}
