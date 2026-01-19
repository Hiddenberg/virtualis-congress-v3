export default function ConfirmedPayment() {
   return (
      <div className="space-y-10">
         <div className="flex flex-col text-center px-4 gap-2">
            <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-8 flex items-center justify-center">
               <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <polyline points="20 6 9 17 4 12" />
               </svg>
            </div>

            <h1 className="text-3xl font-bold text-blue-900 mb-8">
               ¡Pago Confirmado!
            </h1>

            <p className="leading-relaxed">
               Ya completaste todos los pasos de registro. Ahora puedes acceder
               al dashboard del congreso para explorar todas las actividades y
               recursos disponibles.
            </p>
            <div className="mx-auto p-5 bg-rose-200 rounded-3xl text-center md:hidden">
               Ten en cuenta que la plataforma solo está disponible en versión
               de escritorio. Si estás en un dispositivo móvil, por favor,
               accede desde una computadora para acceder al contenido.
            </div>
         </div>
      </div>
   );
}
