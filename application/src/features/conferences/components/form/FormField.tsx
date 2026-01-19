"use client";

import { ReactNode } from "react";

interface FormFieldProps {
   label: string;
   error?: string;
   htmlFor?: string;
   children: ReactNode;
}

export function FormField({ label, error, htmlFor, children }: FormFieldProps) {
   return (
      <div>
         <label
            htmlFor={htmlFor}
            className="block mb-1 font-medium text-gray-800 text-sm"
         >
            {label}
         </label>
         {children}
         {error && <p className="mt-1 text-red-600 text-xs">{error}</p>}
      </div>
   );
}

export default FormField;
