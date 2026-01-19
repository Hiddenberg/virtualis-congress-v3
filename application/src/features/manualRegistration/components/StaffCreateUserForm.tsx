"use client";

import {
   AlertCircle,
   ArrowLeft,
   Calendar,
   CheckCircle,
   Mail,
   Phone,
   User,
   UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { staffCreateAttendantUserAction } from "../serverActions/manualRegistrationActions";

interface FormFieldProps {
   label: string;
   icon: React.ReactNode;
   required?: boolean;
   children: React.ReactNode;
   error?: string;
}

function FormField({
   label,
   icon,
   required = false,
   children,
   error,
}: FormFieldProps) {
   return (
      <div>
         <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
            {icon}
            {label}
            {required && <span className="text-red-500">*</span>}
         </label>
         {children}
         {error && (
            <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
               <AlertCircle size={12} />
               {error}
            </p>
         )}
      </div>
   );
}

export default function StaffCreateUserForm() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [dateOfBirth, setDateOfBirth] = useState("");
   const [isPending, startTransition] = useTransition();
   const router = useRouter();

   // Validation
   const nameError =
      name.trim().length > 0 && name.trim().length < 3
         ? "El nombre debe tener al menos 3 caracteres"
         : "";
   const emailError =
      email.trim().length > 0 && !/.+@.+\..+/.test(email)
         ? "Ingresa un correo electrónico válido"
         : "";

   const canSubmit =
      name.trim().length > 2 && /.+@.+\..+/.test(email) && !isPending;

   const onSubmit = () => {
      if (!canSubmit) return;

      const confirm = window.confirm("¿Estás seguro de crear este usuario?");
      if (!confirm) return;

      startTransition(async () => {
         const res = await staffCreateAttendantUserAction({
            name: name.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            dateOfBirth: dateOfBirth || undefined,
         });
         if (res.success) {
            toast.success("Usuario creado exitosamente");
            router.push("/manual-registration");
         } else {
            toast.error(res.errorMessage);
         }
      });
   };

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="mx-auto px-4 py-8 max-w-3xl">
            {/* Header */}
            <div className="mb-8">
               <Link
                  href="/manual-registration"
                  className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800 transition-colors"
               >
                  <ArrowLeft size={16} />
                  Volver al registro manual
               </Link>

               <h1 className="mb-2 font-bold text-gray-900 text-3xl">
                  Crear Nuevo Usuario
               </h1>
               <p className="text-gray-600 text-lg">
                  Registra a un asistente en la plataforma para poder confirmar
                  su pago manualmente
               </p>
            </div>

            {/* Form Card */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
               <div className="p-6 border-gray-100 border-b">
                  <div className="flex items-center gap-3">
                     <div className="flex justify-center items-center bg-blue-100 rounded-lg w-10 h-10">
                        <UserPlus className="text-blue-600" size={20} />
                     </div>
                     <div>
                        <h2 className="font-semibold text-gray-900 text-lg">
                           Información del Usuario
                        </h2>
                        <p className="text-gray-600 text-sm">
                           Completa los datos del nuevo asistente
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6 p-6">
                  {/* Required Fields Section */}
                  <div>
                     <h3 className="flex items-center gap-2 mb-4 font-medium text-gray-900 text-sm">
                        <div className="bg-red-100 rounded-full w-2 h-2" />
                        Campos Obligatorios
                     </h3>

                     <div className="space-y-4">
                        <FormField
                           label="Nombre Completo"
                           icon={<User size={16} className="text-gray-500" />}
                           required
                           error={nameError}
                        >
                           <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={`
                                 w-full px-4 py-3 border rounded-lg transition-colors
                                 ${
                                    nameError
                                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                       : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                 } focus:ring-2
                              `}
                              placeholder="Ej. Juan Pérez González"
                           />
                        </FormField>

                        <FormField
                           label="Correo Electrónico"
                           icon={<Mail size={16} className="text-gray-500" />}
                           required
                           error={emailError}
                        >
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={`
                                 w-full px-4 py-3 border rounded-lg transition-colors
                                 ${
                                    emailError
                                       ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                       : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                 } focus:ring-2
                              `}
                              placeholder="correo@ejemplo.com"
                           />
                        </FormField>
                     </div>
                  </div>

                  {/* Optional Fields Section */}
                  <div className="pt-6 border-gray-100 border-t">
                     {/* <h3 className="flex items-center gap-2 mb-4 font-medium text-gray-900 text-sm">
                        <div className="bg-blue-100 rounded-full w-2 h-2" />
                        Campos Opcionales
                     </h3> */}

                     <div className="space-y-4">
                        <FormField
                           label="Teléfono"
                           icon={<Phone size={16} className="text-gray-500" />}
                        >
                           <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                              placeholder="Ej. +52 55 1234 5678"
                           />
                        </FormField>

                        <FormField
                           label="Fecha de Nacimiento"
                           icon={
                              <Calendar size={16} className="text-gray-500" />
                           }
                        >
                           <input
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                              placeholder="dd/mm/aaaa"
                           />
                        </FormField>
                     </div>
                  </div>

                  {/* Form Status */}
                  {canSubmit && (
                     <div className="flex items-center gap-2 bg-green-50 p-4 border border-green-200 rounded-lg">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="font-medium text-green-800 text-sm">
                           Formulario completo y listo para enviar
                        </span>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex sm:flex-row flex-col gap-3 pt-6 border-gray-100 border-t">
                     <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || isPending}
                        loading={isPending}
                        variant="blue"
                        className="flex-1"
                     >
                        {isPending ? "Creando usuario..." : "Crear Usuario"}
                     </Button>

                     <Link
                        href="/manual-registration"
                        className="flex justify-center items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
                     >
                        Cancelar
                     </Link>
                  </div>
               </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
               <p className="text-gray-500 text-sm">
                  Una vez creado el usuario, podrás registrar su pago en la
                  página anterior
               </p>
            </div>
         </div>
      </div>
   );
}
