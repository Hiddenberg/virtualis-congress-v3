import { Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { FormField } from "./FormField";

interface RequiredFieldsSectionProps {
   name: string;
   setName: (value: string) => void;
   email: string;
   setEmail: (value: string) => void;
   emailVerification: string;
   setEmailVerification: (value: string) => void;
   nameError: string;
   emailError: string;
   emailVerificationError: string;
}

export function RequiredFieldsSection({
   name,
   setName,
   email,
   setEmail,
   emailVerification,
   setEmailVerification,
   nameError,
   emailError,
   emailVerificationError,
}: RequiredFieldsSectionProps) {
   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      toast.error(
         "No puedes pegar en este campo.\nPor favor vuelve a escribir el correo electrónico para verificar que esté correcto",
      );
   };
   return (
      <div>
         <h3 className="flex items-center gap-2 mb-4 font-medium text-gray-900 text-sm">
            <div className="bg-red-100 rounded-full w-2 h-2" />
            Campos Obligatorios
         </h3>

         <div className="space-y-4">
            <FormField label="Nombre Completo" icon={<User size={16} className="text-gray-500" />} required error={nameError}>
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

            <FormField label="Correo Electrónico" icon={<Mail size={16} className="text-gray-500" />} required error={emailError}>
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

            <FormField
               label="Confirma el correo electrónico"
               icon={<Mail size={16} className="text-gray-500" />}
               required
               error={emailVerificationError}
            >
               <input
                  type="email"
                  value={emailVerification}
                  onChange={(e) => setEmailVerification(e.target.value)}
                  onPaste={handlePaste}
                  className={`
                     w-full px-4 py-3 border rounded-lg transition-colors
                     ${
                        emailVerificationError
                           ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                           : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                     } focus:ring-2
                  `}
                  placeholder="correo@ejemplo.com"
               />
            </FormField>
         </div>
      </div>
   );
}
