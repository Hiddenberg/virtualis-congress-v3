"use client";
export default function RegistrationFormStep3({
   setInputValue,
}: {
   setInputValue: (name: string, value: string) => void;
}) {
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValue(name, value);
   };

   return (
      <div className="text-white">
         <form className="space-y-6 mt-8">
            <div>
               <label>¿Participará en talleres interactivos?</label>
               <div className="flex space-x-10 border-solid rounded-xl text-xl">
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="radio"
                        onChange={handleInputChange}
                        name="Participation"
                        value="true"
                     />
                     Si
                  </label>
                  <br />
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="radio"
                        onChange={handleInputChange}
                        name="Participation"
                        value="false"
                     />
                     No
                  </label>
               </div>
            </div>

            <div>
               <label>¿Prefiere conferencias en vivo o grabadas?</label>
               <div className="flex space-x-10 border-solid rounded-xl text-xl">
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="checkbox"
                        onChange={handleInputChange}
                        name="preferes-live"
                        value="true"
                     />
                     En vivo
                  </label>
                  <br />
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="checkbox"
                        onChange={handleInputChange}
                        name="preferes-recorded"
                        value="false"
                     />
                     Grabada
                  </label>
               </div>
            </div>

            <div>
               <label>Selección de idioma preferido</label>
               <div className="flex space-x-10 border-solid rounded-xl text-xl">
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="checkbox"
                        onChange={handleInputChange}
                        name="espanol-preference"
                        value="español"
                     />
                     Español
                  </label>
                  <br />
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="checkbox"
                        onChange={handleInputChange}
                        name="ingles-preference"
                        value="ingles"
                     />
                     Ingles
                  </label>
               </div>
            </div>

            <div>
               <label>Selección de idioma preferido</label>
               <div className="flex space-x-10 border-solid rounded-xl text-xl">
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="radio"
                        onChange={handleInputChange}
                        name="lenguaje-preference"
                        value="true"
                     />
                     Si
                  </label>
                  <br />
                  <label className="flex gap-1 items-center">
                     <input
                        className="w-5 h-5 border-2 border-blue-200 bg-transparent appearance-none checked:bg-white"
                        type="radio"
                        onChange={handleInputChange}
                        name="lenguaje-preference"
                        value="false"
                     />
                     No
                  </label>
               </div>
            </div>
         </form>
      </div>
   );
}
