import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function FormHeader() {
   return (
      <div className="mb-8">
         <Link
            href="/manual-registration"
            className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800 transition-colors"
         >
            <ArrowLeft size={16} />
            Volver al registro manual
         </Link>

         <h1 className="mb-2 font-bold text-gray-900 text-3xl">Crear Nuevo Usuario</h1>
         <p className="text-gray-600 text-lg">
            Registra a un asistente en la plataforma para poder confirmar su pago manualmente
         </p>
      </div>
   );
}
