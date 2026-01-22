import { ArrowLeft, Home, Info, RotateCcw, XCircle } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";

export default function PaymentFailedPage() {
   return (
      <div className="p-4 md:p-8">
         <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl">
               <div className="bg-linear-to-br from-blue-50 to-white shadow-sm p-6 md:p-8 border border-blue-100 rounded-2xl text-center">
                  <div className="flex justify-center mb-4">
                     <div className="flex justify-center items-center bg-red-100 rounded-full w-12 h-12 text-red-700">
                        <XCircle className="w-6 h-6" />
                     </div>
                  </div>
                  <h1 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">Pago no completado</h1>
                  <p className="mb-6 text-slate-600 text-base md:text-lg">
                     Tu pago fue cancelado o no se pudo procesar. Puedes intentarlo nuevamente.
                  </p>

                  <div className="gap-3 grid grid-cols-1 sm:grid-cols-1 mb-6">
                     <div className="flex justify-center items-center gap-2 bg-white/60 px-4 py-3 border border-blue-100 rounded-xl">
                        <Info className="w-5 h-5 text-blue-700" />
                        <span className="text-slate-700 text-sm md:text-base">
                           Si el cargo aparece pendiente, se liberará automáticamente.
                        </span>
                     </div>
                  </div>

                  <LinkButton href="/congress-recordings/buy" variant="blue" className="mx-auto mb-6">
                     <RotateCcw className="w-4 h-4" />
                     Intentar de nuevo
                  </LinkButton>

                  <div className="flex justify-center items-center gap-3 mt-2">
                     <LinkButton href="/" variant="secondary">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                     </LinkButton>
                     <LinkButton href="/lobby" variant="blue">
                        <Home className="w-4 h-4" />
                        Ir al lobby
                     </LinkButton>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
