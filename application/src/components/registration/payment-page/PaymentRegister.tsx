export default function PaymentRegister() {
   return (
      <div className="flex flex-col justify-center items-center bg-[#F5F6FA] md:mx-auto mt-10 p-10 rounded-3xl md:w-8/12 h-2/4">
         <h1 className="font-semibold text-3xl text-blue-900">¿Ya estás Registrado?</h1>
         <p className="p-7 text-center text-lg">
            Ingresa el correo con el que te registraste para proceder con el pago o verificar el estado de tu inscripción.
         </p>
         <div className="flex justify-center items-center pt-10 w-full md:w-8/12">
            <input type="email" placeholder="Correo electrónico" className="px-4 py-3 border border-black rounded-xl w-10/12" />
         </div>
      </div>
   );
}
