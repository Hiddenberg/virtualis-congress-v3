export default function ModalitySelectionHeader() {
   return (
      <div className="mb-10 sm:mb-12 text-center">
         <div className="inline-flex items-center justify-center mb-4 bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-100">
            <span className="text-blue-700 text-sm font-semibold">Paso 1 de 3</span>
         </div>
         <h1 className="mb-4 font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl leading-tight">
            Elige tu modalidad de participación
         </h1>
         <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Selecciona cómo deseas asistir al congreso
         </p>
      </div>
   );
}
