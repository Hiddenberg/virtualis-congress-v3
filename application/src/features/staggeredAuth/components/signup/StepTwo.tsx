import { ArrowLeftIcon, ArrowRightIcon, Info, Loader2Icon, Mail } from "lucide-react";
import { Button } from "@/components/global/Buttons";
import InputField from "./InputField";

interface StepTwoProps {
   additionalEmail1: string;
   additionalEmail2: string;
   errors: {
      additionalEmail1: string;
      additionalEmail2: string;
   };
   isSubmitting: boolean;
   onAdditionalEmail1Change: (value: string) => void;
   onAdditionalEmail2Change: (value: string) => void;
   onNext: () => void;
   onBack: () => void;
}

export default function StepTwo({
   additionalEmail1,
   additionalEmail2,
   errors,
   isSubmitting,
   onAdditionalEmail1Change,
   onAdditionalEmail2Change,
   onNext,
   onBack,
}: StepTwoProps) {
   return (
      <div className="space-y-4">
         <div className="flex items-start space-x-3 bg-blue-50 p-4 border border-blue-200 rounded-lg">
            <Info className="mt-0.5 w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-blue-800 text-sm leading-relaxed">
               Puedes agregar correos electrónicos adicionales. Podrás iniciar sesión y recibir notificaciones con cualquiera de
               estos correos.
            </p>
         </div>

         <InputField
            id="additionalEmail1"
            label="Correo electrónico adicional 1 (opcional)"
            type="email"
            value={additionalEmail1}
            onChange={onAdditionalEmail1Change}
            placeholder="correo1@ejemplo.com (opcional)"
            error={errors.additionalEmail1}
            icon={<Mail className="w-5 h-5 text-gray-500" />}
         />

         <InputField
            id="additionalEmail2"
            label="Correo electrónico adicional 2 (opcional)"
            type="email"
            value={additionalEmail2}
            onChange={onAdditionalEmail2Change}
            placeholder="correo2@ejemplo.com (opcional)"
            error={errors.additionalEmail2}
            icon={<Mail className="w-5 h-5 text-gray-500" />}
         />

         <div className="flex space-x-4">
            <button
               type="button"
               onClick={onBack}
               className="flex flex-1 justify-center items-center space-x-2 bg-gray-200 hover:bg-gray-300 shadow-sm hover:shadow-md px-4 py-4 rounded-xl font-semibold text-gray-700 transition-all duration-200"
            >
               <ArrowLeftIcon className="w-5 h-5" />
               <span>Atrás</span>
            </button>
            <Button loading={isSubmitting} onClick={onNext} variant="blue" className="p-4! w-full!">
               {isSubmitting ? "Verificando..." : "Continuar"}
               {isSubmitting ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <ArrowRightIcon className="w-5 h-5" />}
            </Button>
         </div>
      </div>
   );
}
