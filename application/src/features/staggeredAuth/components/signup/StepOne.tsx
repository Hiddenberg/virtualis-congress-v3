import { ArrowRight, Mail, User } from "lucide-react";
import InputField from "./InputField";

interface StepOneProps {
   email: string;
   name: string;
   errors: {
      email: string;
      name: string;
   };
   onEmailChange: (value: string) => void;
   onNameChange: (value: string) => void;
   onNext: () => void;
}

export default function StepOne({
   email,
   name,
   errors,
   onEmailChange,
   onNameChange,
   onNext,
}: StepOneProps) {
   return (
      <div className="space-y-8">
         <InputField
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="tu@email.com"
            error={errors.email}
            icon={<Mail className="w-5 h-5 text-gray-500" />}
         />

         <InputField
            id="name"
            label="Nombre completo"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Tu nombre completo"
            error={errors.name}
            icon={<User className="w-5 h-5 text-gray-500" />}
         />

         <button
            type="button"
            onClick={onNext}
            className="flex justify-center items-center space-x-3 bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-6 py-4 rounded-xl w-full font-bold text-white transition-all hover:-translate-y-0.5 duration-200"
         >
            <span>Continuar</span>
            <ArrowRight className="w-5 h-5" />
         </button>
      </div>
   );
}
