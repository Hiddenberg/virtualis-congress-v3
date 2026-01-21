"use client";

function RegistrationFormStep1({ setInputValue }: { setInputValue: (name: string, value: string) => void }) {
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setInputValue(name, value);
   };

   return (
      <form className="space-y-6 mt-8">
         <div>
            <label htmlFor="fullName" className="block mb-2">
               Nombre completo
            </label>
            <input
               type="text"
               id="fullName"
               name="fullName"
               onChange={handleInputChange}
               required
               className="bg-transparent p-2 border-white border-b-2 focus:outline-none w-full text-white"
            />
         </div>

         <div>
            <label htmlFor="email" className="block mb-2">
               Correo electrónico
            </label>
            <input
               type="email"
               id="email"
               name="email"
               onChange={handleInputChange}
               required
               className="bg-transparent p-2 border-white border-b-2 focus:outline-none w-full text-white"
            />
         </div>

         <div>
            <label htmlFor="phone" className="block mb-2">
               Número de teléfono
            </label>
            <input
               type="tel"
               id="phone"
               name="phone"
               onChange={handleInputChange}
               required
               className="bg-transparent p-2 border-white border-b-2 focus:outline-none w-full text-white"
            />
         </div>

         <div>
            <label htmlFor="birthDate" className="block mb-2">
               Fecha de nacimiento
            </label>
            <input
               type="date"
               id="birthDate"
               name="birthDate"
               onChange={handleInputChange}
               required
               className="bg-transparent p-2 border-white border-b-2 w-full text-white"
            />
         </div>
      </form>
   );
}

export default RegistrationFormStep1;
