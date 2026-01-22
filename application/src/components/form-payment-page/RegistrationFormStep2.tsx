"use client";
export default function RegistrationFormStep2({ setInputValue }: { setInputValue: (name: string, value: string) => void }) {
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValue(name, value);
   };

   return (
      <div className="text-white">
         <form className="space-y-6 mt-8">
            <div>
               <label htmlFor="fullName" className="block mb-2">
                  Profesion a cargo
               </label>
               <input
                  type="text"
                  id="fullName"
                  name="profession"
                  onChange={handleInputChange}
                  required
                  className="bg-transparent p-2 border-white border-b-2 w-full text-white"
               />
            </div>

            <div>
               <label htmlFor="email" className="block mb-2">
                  Especialidad médica
               </label>
               <input
                  type="email"
                  id="email"
                  name="speciality"
                  onChange={handleInputChange}
                  required
                  className="bg-transparent p-2 border-white border-b-2 w-full text-white"
               />
            </div>

            <div>
               <label htmlFor="phone" className="block mb-2">
                  Institución o lugar de trabajo
               </label>
               <input
                  type="tel"
                  id="phone"
                  name="workplace"
                  onChange={handleInputChange}
                  required
                  className="bg-transparent p-2 border-white border-b-2 w-full text-white"
               />
            </div>

            <div>
               <label htmlFor="experience" className="block mb-2">
                  Años de experiencia (opcional)
               </label>
               <select
                  id="experience"
                  onChange={(e) => {
                     const { name, value } = e.target;
                     setInputValue(name, value);
                  }}
                  name="experience"
                  className="bg-transparent p-2 border-white border-b-2 w-full text-white"
               >
                  <option className="text-black" value="1">
                     1 año
                  </option>
                  <option className="text-black" value="2">
                     2 años
                  </option>
                  <option className="text-black" value="3">
                     3 años
                  </option>
                  <option className="text-black" value="4">
                     4 años
                  </option>
               </select>
            </div>
         </form>
      </div>
   );
}
