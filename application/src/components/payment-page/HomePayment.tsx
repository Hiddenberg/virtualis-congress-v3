import { CheckCircle } from "lucide-react";

export default function HomePayment() {
   return (
      <div className="flex flex-col justify-center items-center">
         <div className="items-center mx-auto px-4 pt-20 max-w-2xl text-center">
            <div className="mb-8">
               <svg viewBox="0 0 24 24" className="opacity-80 mx-auto w-16 h-16 text-blue-900" fill="currentColor">
                  <title>Checkmark icon</title>
                  <CheckCircle />
               </svg>
            </div>

            <h1 className="mb-5 font-bold text-blue-900 text-2xl">¡Ya estás Registrado!</h1>

            <p className="mb-2 text-lg">
               Ahora toca realizar el último paso para inscribirte. Realiza tu pago aquí o revisa tu correo
               (correousuario@gmail.com) para completar tu inscripción.
            </p>
         </div>
      </div>
   );
}
