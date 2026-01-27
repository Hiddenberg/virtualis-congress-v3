import type { ReactNode } from "react";

interface InputFieldProps {
   id: string;
   label: string;
   type: string;
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   error?: string;
   icon?: ReactNode;
   disablePaste?: boolean;
}

export default function InputField({ id, label, type, value, onChange, placeholder, error, icon, disablePaste }: InputFieldProps) {
   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disablePaste) {
         e.preventDefault();
      }
   };

   const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disablePaste) {
         e.preventDefault();
      }
   };

   const handleCut = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disablePaste) {
         e.preventDefault();
      }
   };

   return (
      <div>
         <label htmlFor={id} className="block mb-2 font-medium text-gray-700 text-sm">
            {label}
         </label>
         <div className="relative">
            {icon && (
               <div className="left-0 absolute inset-y-0 flex items-center ml-2 pl-2 h-full pointer-events-none">{icon}</div>
            )}
            <input
               id={id}
               type={type}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               onPaste={handlePaste}
               onCopy={handleCopy}
               onCut={handleCut}
               className={`block w-full ${icon ? "pl-11" : "pl-3"} pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
               }`}
               placeholder={placeholder}
            />
         </div>
         {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
   );
}
