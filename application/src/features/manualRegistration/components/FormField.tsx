import { AlertCircle } from "lucide-react";
import React, { useId } from "react";

interface FormFieldProps {
   label: string;
   icon: React.ReactNode;
   required?: boolean;
   children: React.ReactNode;
   error?: string;
}

export function FormField({ label, icon, required = false, children, error }: FormFieldProps) {
   const id = useId();
   return (
      <div>
         <label htmlFor={id} className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
            {icon}
            {label}
            {required && <span className="text-red-500">*</span>}
         </label>
         {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id }) : children}
         {error && (
            <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
               <AlertCircle size={12} />
               {error}
            </p>
         )}
      </div>
   );
}
