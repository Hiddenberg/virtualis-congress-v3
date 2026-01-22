export default function ConfirmedPayment() {
   return (
      <div className="space-y-10">
         <div className="flex flex-col gap-2 px-4 text-center">
            <div className="flex justify-center items-center bg-gray-400 mx-auto mb-8 rounded-full w-24 h-24">
               <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <title>Checkmark icon</title>
                  <polyline points="20 6 9 17 4 12" />
               </svg>
            </div>

            <h1 className="mb-8 font-bold text-blue-900 text-3xl">¡Pago Confirmado!</h1>

            <p className="leading-relaxed">
               Ya completaste todos los pasos de registro. Ahora puedes acceder al dashboard del congreso para explorar todas las
               actividades y recursos disponibles.
            </p>
            <div className="md:hidden bg-rose-200 mx-auto p-5 rounded-3xl text-center">
               Ten en cuenta que la plataforma solo está disponible en versión de escritorio. Si estás en un dispositivo móvil,
               por favor, accede desde una computadora para acceder al contenido.
            </div>
         </div>
      </div>
   );
}
