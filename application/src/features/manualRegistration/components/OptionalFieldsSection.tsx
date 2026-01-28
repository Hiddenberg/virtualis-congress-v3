import { Calendar, Info, Mail, Phone } from "lucide-react";
import { FormField } from "./FormField";

interface OptionalFieldsSectionProps {
   phoneNumber: string;
   setPhoneNumber: (value: string) => void;
   dateOfBirth: string;
   setDateOfBirth: (value: string) => void;
   additionalEmail1: string;
   setAdditionalEmail1: (value: string) => void;
   additionalEmail2: string;
   setAdditionalEmail2: (value: string) => void;
   additionalEmail1Error: string;
   additionalEmail2Error: string;
}

export function OptionalFieldsSection({
   phoneNumber,
   setPhoneNumber,
   dateOfBirth,
   setDateOfBirth,
   additionalEmail1,
   setAdditionalEmail1,
   additionalEmail2,
   setAdditionalEmail2,
   additionalEmail1Error,
   additionalEmail2Error,
}: OptionalFieldsSectionProps) {
   return (
      <div className="pt-6 border-gray-100 border-t">
         <div className="space-y-4">
            <FormField label="Teléfono" icon={<Phone size={16} className="text-gray-500" />}>
               <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                  placeholder="Ej. +52 55 1234 5678"
               />
            </FormField>

            <FormField label="Fecha de Nacimiento" icon={<Calendar size={16} className="text-gray-500" />}>
               <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                  placeholder="dd/mm/aaaa"
               />
            </FormField>

            <div className="flex items-start space-x-3 bg-blue-50 p-4 border border-blue-200 rounded-lg">
               <Info className="mt-0.5 w-5 h-5 text-blue-600 shrink-0" size={16} />
               <p className="text-blue-800 text-sm leading-relaxed">
                  Puedes agregar correos electrónicos adicionales. El usuario podrá iniciar sesión y recibir notificaciones con
                  cualquiera de estos correos.
               </p>
            </div>

            <FormField
               label="Correo electrónico adicional 1 (opcional)"
               icon={<Mail size={16} className="text-gray-500" />}
               error={additionalEmail1Error}
            >
               <input
                  type="email"
                  value={additionalEmail1}
                  onChange={(e) => setAdditionalEmail1(e.target.value)}
                  className={`
                     px-4 py-3 border rounded-lg w-full transition-colors
                     ${
                        additionalEmail1Error
                           ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                           : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                     } focus:ring-2
                  `}
                  placeholder="correo1@ejemplo.com (opcional)"
               />
            </FormField>

            <FormField
               label="Correo electrónico adicional 2 (opcional)"
               icon={<Mail size={16} className="text-gray-500" />}
               error={additionalEmail2Error}
            >
               <input
                  type="email"
                  value={additionalEmail2}
                  onChange={(e) => setAdditionalEmail2(e.target.value)}
                  className={`
                     px-4 py-3 border rounded-lg w-full transition-colors
                     ${
                        additionalEmail2Error
                           ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                           : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                     } focus:ring-2
                  `}
                  placeholder="correo2@ejemplo.com (opcional)"
               />
            </FormField>
         </div>
      </div>
   );
}
