import { ArrowRightIcon, Loader2Icon, Mail, User } from "lucide-react";
import { Button } from "@/components/global/Buttons";
import InputField from "./InputField";

interface StepOneProps {
   email: string;
   emailVerification: string;
   name: string;
   errors: {
      email: string;
      emailVerification: string;
      name: string;
   };
   isSubmitting: boolean;
   onEmailChange: (value: string) => void;
   onEmailVerificationChange: (value: string) => void;
   onNameChange: (value: string) => void;
   onNext: () => void;
}

export default function StepOne({
   email,
   emailVerification,
   isSubmitting,
   name,
   errors,
   onEmailChange,
   onEmailVerificationChange,
   onNameChange,
   onNext,
}: StepOneProps) {
   return (
      <div className="space-y-8">
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
            id="emailVerification"
            label="Confirma tu correo electrónico"
            type="email"
            value={emailVerification}
            onChange={onEmailVerificationChange}
            placeholder="tu@email.com"
            error={errors.emailVerification}
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            disablePaste={true}
         />

         <Button loading={isSubmitting} onClick={onNext} variant="blue" className="p-4! w-full!">
            {isSubmitting ? "Verificando..." : "Continuar"}
            {isSubmitting ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <ArrowRightIcon className="w-5 h-5" />}
         </Button>
      </div>
   );
}
