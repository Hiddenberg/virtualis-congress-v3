"use client";

import { BarChart2 } from "lucide-react";
import { useState } from "react";

const surveyOptions = ["Regulaciones", "Costos de producción", "Investigación clínica limitada", "Complejidad de fabricación"];

export default function SurveyComponent() {
   const [selectedOption, setSelectedOption] = useState<string | null>(null);

   return (
      <div className="bg-gray-100 shadow-md mx-auto p-6 rounded-xl w-full">
         <div className="flex items-center mb-4">
            <BarChart2 className="mr-2 w-6 h-6 text-gray-700" />
            <h2 className="font-semibold text-xl">Encuesta</h2>
         </div>
         <div className="mb-4">
            <h3 className="font-medium text-lg">
               ¿Cuál es el mayor desafío en la implementación de la nanotecnología en medicamentos?
            </h3>
         </div>
         <form>
            {surveyOptions.map((option) => (
               <div key={option} className="mb-2">
                  <label className="flex items-center bg-white hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
                     <input
                        type="radio"
                        name="survey"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                        className="w-5 h-5 text-blue-600 form-radio"
                     />
                     <span className="ml-2 text-gray-700">{option}</span>
                  </label>
               </div>
            ))}
         </form>
      </div>
   );
}
