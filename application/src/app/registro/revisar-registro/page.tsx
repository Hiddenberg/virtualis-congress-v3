import Link from "next/link";
import HeaderBlack from "@/components/registration/HeaderBlack";
import PaymentRegister from "@/components/registration/payment-page/PaymentRegister";

export default function PaymentPage() {
   return (
      <div className="space-y-10 bg-white p-4 md:px-10 h-screen">
         <HeaderBlack />
         <PaymentRegister />
         <div className="flex justify-center mb-4">
            <Link
               href="/registro/confirmacion-registro"
               className="block bg-yellow-400 mt-8 py-3 rounded-xl w-64 md:w-1/4 font-medium text-black text-center transition-colors"
            >
               Confirmar Registro
            </Link>
         </div>
      </div>
   );
}
