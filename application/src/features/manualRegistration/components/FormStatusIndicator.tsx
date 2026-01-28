import { CheckCircle } from "lucide-react";

interface FormStatusIndicatorProps {
   canSubmit: boolean;
}

export function FormStatusIndicator({ canSubmit }: FormStatusIndicatorProps) {
   if (!canSubmit) return null;

   return (
      <div className="flex items-center gap-2 bg-green-50 p-4 border border-green-200 rounded-lg">
         <CheckCircle className="text-green-600" size={16} />
         <span className="font-medium text-green-800 text-sm">Formulario completo y listo para enviar</span>
      </div>
   );
}
