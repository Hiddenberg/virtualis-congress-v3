"use client";
import Link from "next/link";
import { useState } from "react";
import RegistrationFormStep1 from "./RegistrationFormStep1";
import RegistrationFormStep2 from "./RegistrationFormStep2";
import RegistrationFormStep3 from "./RegistrationFormStep3";

export default function RegistrationForm() {
   const [formData, setFormData] = useState<Record<string, string>>({});

   const setInputValue = (name: string, value: string) => {
      const newFormData = {
         ...formData,
      };
      newFormData[name] = value;
      setFormData(newFormData);
   };

   const stages = [
      {
         title: "Información Personal",
         formComponent: <RegistrationFormStep1 setInputValue={setInputValue} />,
      },
      {
         title: "Detalles Profesionales",
         formComponent: <RegistrationFormStep2 setInputValue={setInputValue} />,
      },
      {
         title: "Preferencias del Evento",
         formComponent: <RegistrationFormStep3 setInputValue={setInputValue} />,
      },
   ];

   const [currentStage, setCurrentStage] = useState(0);

   return (
      <div className="text-white">
         <h1 className="mb-2">
            <span className="font-bold text-2xl text-yellow-400">
               PASO {currentStage + 1}:
            </span>
            <span className="text-yellow-400">
               {stages[currentStage].title}
            </span>
         </h1>
         <div className="flex flex-col">
            <h2 className="mb-2 text-xl">¿Ya completaste tu registro?</h2>
            <p>
               <button className="border-yellow-400 border-b text-yellow-300">
                  <Link href="/registration-home/registrationpaymentpage">
                     Haz clic aquí
                  </Link>
               </button>{" "}
               para proceder al pago y asegurar tu participación.
            </p>
         </div>

         {stages[currentStage].formComponent}

         <div className="flex justify-center space-x-2 mt-6">
            {currentStage === stages.length - 1 ? (
               <button
                  type="button"
                  onClick={() => RegistrationForm}
                  className="bg-yellow-400 mt-8 py-3 rounded-xl w-64 font-medium text-black"
               >
                  <Link href="/registration-home/homepaymentpage">
                     Confirmar Registro
                  </Link>
               </button>
            ) : (
               <button
                  type="button"
                  onClick={() => setCurrentStage(currentStage + 1)}
                  className="bg-white mt-8 py-3 rounded-xl w-64 font-medium text-black"
               >
                  Siguiente
               </button>
            )}
         </div>

         <div className="flex justify-center space-x-2 mt-6">
            {stages.map((_, index) => (
               <button
                  onClick={() => setCurrentStage(index)}
                  key={index}
                  className={`rounded-full w-2 h-2 ${
                     index === currentStage ? "bg-white" : "bg-gray-500"
                  }`}
               />
            ))}
         </div>
      </div>
   );
}
