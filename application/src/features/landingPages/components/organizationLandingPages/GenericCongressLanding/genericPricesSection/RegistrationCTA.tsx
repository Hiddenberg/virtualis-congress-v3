import Link from "next/link";

interface RegistrationCTAProps {
   userId?: string;
}

export default function RegistrationCTA({ userId }: RegistrationCTAProps) {
   return (
      <div className="rounded-2xl p-8 text-white text-center mb-12 bg-linear-to-r from-blue-900 via-blue-700 to-cyan-600">
         <h3 className="mb-4 font-bold text-3xl">¡INSCRÍBETE YA!</h3>
         <p className="mb-6 text-lg text-blue-100">
            Asegura tu lugar en el congreso más importante de medicina interna en la región
         </p>
         <div className="flex sm:flex-row flex-col justify-center gap-4">
            {!userId && (
               <Link
                  href="/signup"
                  className="px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg bg-white text-blue-900 hover:bg-gray-100"
               >
                  Quiero Registrarme
               </Link>
            )}
            <Link
               href="/lobby"
               className="px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg bg-white text-blue-900 hover:bg-gray-100"
            >
               Entrar con mi cuenta
            </Link>
         </div>
      </div>
   );
}
