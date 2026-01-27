import { ArrowLeft, Calendar, Check, Loader2, Phone } from "lucide-react";
import InputField from "./InputField";
import SecurityNote from "./SecurityNote";

interface StepTwoProps {
   dateOfBirth: string;
   phoneNumber: string;
   errors: {
      dateOfBirth: string;
      phoneNumber: string;
   };
   isSubmitting: boolean;
   onDateOfBirthChange: (value: string) => void;
   onPhoneNumberChange: (value: string) => void;
   onBack: () => void;
   onSubmit: () => void;
}

export default function StepTwo({
   dateOfBirth,
   phoneNumber,
   errors,
   isSubmitting,
   onDateOfBirthChange,
   onPhoneNumberChange,
   onBack,
   onSubmit,
}: StepTwoProps) {
   return (
      <div className="space-y-8">
         <SecurityNote />

         <InputField
            id="dateOfBirth"
            label="Fecha de nacimiento"
            type="date"
            value={dateOfBirth}
            onChange={onDateOfBirthChange}
            error={errors.dateOfBirth}
            icon={<Calendar className="w-5 h-5 text-gray-500" />}
            required={true}
         />

         <InputField
            id="phoneNumber"
            label="Número de teléfono (solo números)"
            type="tel"
            value={phoneNumber}
            onChange={onPhoneNumberChange}
            placeholder="5555555555"
            error={errors.phoneNumber}
            icon={<Phone className="w-5 h-5 text-gray-500" />}
            required={true}
         />

         <div className="flex space-x-4">
            <button
               type="button"
               onClick={onBack}
               className="flex flex-1 justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 shadow-sm hover:shadow-md px-4 py-4 rounded-xl font-semibold text-gray-700 transition-all duration-200"
            >
               <ArrowLeft className="w-4 h-4" />
               <span>Atrás</span>
            </button>
            <button
               type="button"
               onClick={onSubmit}
               disabled={isSubmitting}
               className="flex flex-2 justify-center items-center space-x-3 bg-linear-to-r from-blue-600 hover:from-blue-700 disabled:from-gray-400 to-blue-700 hover:to-blue-800 disabled:to-gray-500 shadow-lg hover:shadow-xl disabled:hover:shadow-lg px-6 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 duration-200"
            >
               <span>{isSubmitting ? "Registrando..." : "Registrarme"}</span>
               {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            </button>
         </div>
      </div>
   );
}
